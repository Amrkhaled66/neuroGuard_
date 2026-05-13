import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { db } from 'src/db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/db/index';
import { desc, eq } from 'drizzle-orm';
import { SeizureEventsService } from 'src/seizure-events/seizure-events.service';
import { access } from 'fs/promises';
import { basename } from 'path';
import { ConfigService } from '@nestjs/config';

type SessionRecord = {
  id: number;
  patientId: number;
  filePath: string | null;
  duration: number;
  status: string;
  note: string | null;
  channelCount: number;
  createdAt: Date | null;
  updatedAt: Date | null;
};

type ModelPredictionResponse = {
  success: boolean;
  file: string;
  resolved_path?: string;
  seizure_count: number;
  seizures: Array<{
    start_time_seconds: number;
    end_time_seconds: number;
  }>;
};

@Injectable()
export class SessionsService {
  private readonly modelApiUrl: string;

  constructor(
    @Inject(db) private readonly db: NodePgDatabase<typeof schema>,
    private readonly seizureEventsService: SeizureEventsService,
    private readonly configService: ConfigService,
  ) {
    this.modelApiUrl =
      this.configService.get<string>('MODEL_API_URL')?.replace(/\/$/, '') ??
      'http://127.0.0.1:5000';
  }

  private readonly sessionSelect = {
    id: schema.sessions.id,
    patientId: schema.sessions.patientId,
    filePath: schema.sessions.filePath,
    duration: schema.sessions.duration,
    status: schema.sessions.status,
    note: schema.sessions.note,
    channelCount: schema.sessions.channelCount,
    createdAt: schema.sessions.createdAt,
    updatedAt: schema.sessions.updatedAt,
  };

  private async attachSeizureCounts<T extends { id: number }>(sessions: T[]) {
    const seizureCounts = await this.seizureEventsService.getCountsBySessionIds(
      sessions.map((session) => session.id),
    );

    return sessions.map((session) => ({
      ...session,
      seizureCount: seizureCounts.get(session.id) ?? 0,
    }));
  }

  private async updateSessionStatus(id: number, status: string) {
    await this.db
      .update(schema.sessions)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(schema.sessions.id, id));
  }

  private async loadSessionOrThrow(id: number): Promise<SessionRecord> {
    const [session] = await this.db
      .select(this.sessionSelect)
      .from(schema.sessions)
      .where(eq(schema.sessions.id, id));

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }

  private async requestModelPrediction(
    filePath: string,
  ): Promise<ModelPredictionResponse> {
    const response = await fetch(`${this.modelApiUrl}/predict-seizures`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        edf_file: basename(filePath),
      }),
    });

    const payload = (await response.json()) as ModelPredictionResponse & {
      error?: string;
    };

    if (!response.ok || !payload.success || !Array.isArray(payload.seizures)) {
      throw new Error(payload.error || 'Model prediction failed');
    }

    return payload;
  }

  private async analyzeSession(sessionId: number) {
    const session = await this.loadSessionOrThrow(sessionId);

    if (!session.filePath) {
      throw new Error('Session file path is missing');
    }

    const prediction = await this.requestModelPrediction(session.filePath);

    await this.seizureEventsService.replaceSessionEvents(
      sessionId,
      prediction.seizures.map((seizure) => ({
        startTimeSeconds: Math.round(seizure.start_time_seconds),
        endTimeSeconds: Math.round(seizure.end_time_seconds),
      })),
    );

    await this.updateSessionStatus(sessionId, 'analyzed');
  }

  private startAnalysis(sessionId: number) {
    void this.analyzeSession(sessionId).catch(async () => {
      await this.updateSessionStatus(sessionId, 'failed');
    });
  }

  async create(createSessionDto: CreateSessionDto, filePath?: string) {
    const patientId = Number(createSessionDto.patientId);
    const duration = Number(createSessionDto.duration);
    const channelCount = Number(createSessionDto.channelCount);

    const [newSession] = await this.db
      .insert(schema.sessions)
      .values({
        patientId,
        filePath: filePath ?? null,
        duration,
        status: 'processing',
        note: createSessionDto.note,
        channelCount,
      })
      .returning();

    this.startAnalysis(newSession.id);

    return {
      ...newSession,
      seizureCount: 0,
    };
  }

  async findAll() {
    const sessions = await this.db
      .select(this.sessionSelect)
      .from(schema.sessions)
      .orderBy(desc(schema.sessions.createdAt), desc(schema.sessions.id));

    return this.attachSeizureCounts(sessions);
  }

  async findAllByPatient(patientId: number) {
    const sessions = await this.db
      .select(this.sessionSelect)
      .from(schema.sessions)
      .where(eq(schema.sessions.patientId, patientId))
      .orderBy(desc(schema.sessions.createdAt), desc(schema.sessions.id));

    return this.attachSeizureCounts(sessions);
  }

  async findOne(id: number) {
    const session = await this.loadSessionOrThrow(id);

    const [sessionWithSeizureCount] = await this.attachSeizureCounts([session]);

    return sessionWithSeizureCount;
  }

  async getDownloadInfo(id: number) {
    const [session] = await this.db
      .select({
        id: schema.sessions.id,
        filePath: schema.sessions.filePath,
      })
      .from(schema.sessions)
      .where(eq(schema.sessions.id, id));

    if (!session || !session.filePath) {
      throw new NotFoundException('Session file not found');
    }

    try {
      await access(session.filePath);
    } catch {
      throw new NotFoundException('Session file not found');
    }

    return {
      filePath: session.filePath,
      fileName: basename(session.filePath),
    };
  }

  async update(id: number, updateSessionDto: UpdateSessionDto) {
    const [updatedSession] = await this.db
      .update(schema.sessions)
      .set({
        ...(updateSessionDto.filePath !== undefined
          ? { filePath: updateSessionDto.filePath }
          : {}),
        ...(updateSessionDto.duration !== undefined
          ? { duration: updateSessionDto.duration }
          : {}),
        ...(updateSessionDto.status !== undefined
          ? { status: updateSessionDto.status }
          : {}),
        ...(updateSessionDto.note !== undefined
          ? { note: updateSessionDto.note }
          : {}),
        ...(updateSessionDto.channelCount !== undefined
          ? { channelCount: updateSessionDto.channelCount }
          : {}),
        updatedAt: new Date(),
      })
      .where(eq(schema.sessions.id, id))
      .returning();

    if (!updatedSession) {
      throw new NotFoundException('Session not found');
    }

    const [sessionWithSeizureCount] = await this.attachSeizureCounts([
      updatedSession,
    ]);

    return sessionWithSeizureCount;
  }

  async remove(id: number) {
    const [deletedSession] = await this.db
      .delete(schema.sessions)
      .where(eq(schema.sessions.id, id))
      .returning();

    if (!deletedSession) {
      throw new NotFoundException('Session not found');
    }

    return deletedSession;
  }
}
