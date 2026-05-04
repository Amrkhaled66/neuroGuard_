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

@Injectable()
export class SessionsService {
  constructor(
    @Inject(db) private readonly db: NodePgDatabase<typeof schema>,
    private readonly seizureEventsService: SeizureEventsService,
  ) {}

  private async attachSeizureCounts<T extends { id: number }>(sessions: T[]) {
    const seizureCounts = await this.seizureEventsService.getCountsBySessionIds(
      sessions.map((session) => session.id),
    );

    return sessions.map((session) => ({
      ...session,
      seizureCount: seizureCounts.get(session.id) ?? 0,
    }));
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
        status: createSessionDto.status ?? 'processing',
        note: createSessionDto.note,
        channelCount,
      })
      .returning();

    return newSession;
  }

  async findAll() {
    const sessions = await this.db
      .select({
        id: schema.sessions.id,
        patientId: schema.sessions.patientId,
        filePath: schema.sessions.filePath,
        duration: schema.sessions.duration,
        status: schema.sessions.status,
        note: schema.sessions.note,
        channelCount: schema.sessions.channelCount,
        createdAt: schema.sessions.createdAt,
        updatedAt: schema.sessions.updatedAt,
      })
      .from(schema.sessions)
      .orderBy(desc(schema.sessions.createdAt), desc(schema.sessions.id));

      return this.attachSeizureCounts(sessions);
    }

  async findAllByPatient(patientId: number) {
    console.log(patientId)
    const sessions = await this.db
      .select({
        id: schema.sessions.id,
        patientId: schema.sessions.patientId,
        filePath: schema.sessions.filePath,
        duration: schema.sessions.duration,
        status: schema.sessions.status,
        note: schema.sessions.note,
        channelCount: schema.sessions.channelCount,
        createdAt: schema.sessions.createdAt,
        updatedAt: schema.sessions.updatedAt,
      })
      .from(schema.sessions)
      .where(eq(schema.sessions.patientId, patientId))
      .orderBy(desc(schema.sessions.createdAt), desc(schema.sessions.id));
      
      console.log(sessions)
    return this.attachSeizureCounts(sessions);
  }

  async findOne(id: number) {
    const [session] = await this.db
      .select({
        id: schema.sessions.id,
        patientId: schema.sessions.patientId,
        filePath: schema.sessions.filePath,
        duration: schema.sessions.duration,
        status: schema.sessions.status,
        note: schema.sessions.note,
        channelCount: schema.sessions.channelCount,
        createdAt: schema.sessions.createdAt,
        updatedAt: schema.sessions.updatedAt,
      })
      .from(schema.sessions)
      .where(eq(schema.sessions.id, id));

    if (!session) {
      throw new NotFoundException('Session not found');
    }

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
    // Resource created, logic to be implemented
  }

  async remove(id: number) {
    // Resource created, logic to be implemented
  }
}
