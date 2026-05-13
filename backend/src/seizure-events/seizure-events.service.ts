import {
  ForbiddenException,
  Injectable,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { CreateSeizureEventDto } from './dto/create-seizure-event.dto';
import { UpdateSeizureEventDto } from './dto/update-seizure-event.dto';
import { db } from 'src/db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/db/index';
import { desc, eq, inArray, sql } from 'drizzle-orm';
import { Roles } from 'src/common/enums/roles.enum';
import { basename } from 'path';

type AnalyticsSession = {
  id: number;
  status: string;
  filePath: string | null;
  createdAt: Date | null;
};

type AnalyticsEvent = {
  eventId: number;
  sessionId: number;
  sessionDate: Date | null;
  filePath: string | null;
  startTimeSeconds: number;
  endTimeSeconds: number;
};

@Injectable()
export class SeizureEventsService {
  constructor(@Inject(db) private readonly db: NodePgDatabase<typeof schema>) {}

  private async getPatientOrThrow(patientId: number) {
    const [patient] = await this.db
      .select({
        id: schema.patients.id,
        doctorId: schema.patients.doctorId,
      })
      .from(schema.patients)
      .where(eq(schema.patients.id, patientId));

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return patient;
  }

  private async ensureAccess(
    patientId: number,
    currentUserId: number,
    role: Roles,
  ) {
    const patient = await this.getPatientOrThrow(patientId);

    if (role === Roles.DOCTOR && patient.doctorId !== currentUserId) {
      throw new ForbiddenException('You do not have access to this patient');
    }

    if (role === Roles.PATIENT && patient.id !== currentUserId) {
      throw new ForbiddenException('You do not have access to this patient');
    }

    return patient;
  }

  private toDateKey(date: Date) {
    return date.toISOString().slice(0, 10);
  }

  private createDateSeries(startDate: Date, endDate: Date) {
    const dates: string[] = [];
    const cursor = new Date(startDate);

    while (cursor <= endDate) {
      dates.push(this.toDateKey(cursor));
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    return dates;
  }

  async getCountsBySessionIds(sessionIds: number[]) {
    if (sessionIds.length === 0) {
      return new Map<number, number>();
    }

    const seizureCounts = await this.db
      .select({
        sessionId: schema.seizureEvents.sessionId,
        seizureCount: sql<number>`count(*)`,
      })
      .from(schema.seizureEvents)
      .where(inArray(schema.seizureEvents.sessionId, sessionIds))
      .groupBy(schema.seizureEvents.sessionId);

    return new Map(
      seizureCounts.map((entry) => [
        entry.sessionId,
        Number(entry.seizureCount ?? 0),
      ]),
    );
  }

  async create(createSeizureEventDto: CreateSeizureEventDto) {
    const [createdEvent] = await this.db
      .insert(schema.seizureEvents)
      .values({
        sessionId: createSeizureEventDto.sessionId,
        onsetSide: createSeizureEventDto.onsetSide ?? null,
        onsetRegion: createSeizureEventDto.onsetRegion ?? null,
        startTimeSeconds: createSeizureEventDto.startTimeSeconds,
        endTimeSeconds: createSeizureEventDto.endTimeSeconds,
      })
      .returning();

    return createdEvent;
  }

  async findAll() {
    return this.db
      .select()
      .from(schema.seizureEvents)
      .orderBy(
        desc(schema.seizureEvents.createdAt),
        desc(schema.seizureEvents.id),
      );
  }

  async findOne(id: number) {
    const [event] = await this.db
      .select()
      .from(schema.seizureEvents)
      .where(eq(schema.seizureEvents.id, id));

    if (!event) {
      throw new NotFoundException('Seizure event not found');
    }

    return event;
  }

  async update(id: number, updateSeizureEventDto: UpdateSeizureEventDto) {
    const [updatedEvent] = await this.db
      .update(schema.seizureEvents)
      .set({
        onsetSide: updateSeizureEventDto.onsetSide,
        onsetRegion: updateSeizureEventDto.onsetRegion,
        startTimeSeconds: updateSeizureEventDto.startTimeSeconds,
        endTimeSeconds: updateSeizureEventDto.endTimeSeconds,
        updatedAt: new Date(),
      })
      .where(eq(schema.seizureEvents.id, id))
      .returning();

    if (!updatedEvent) {
      throw new NotFoundException('Seizure event not found');
    }

    return updatedEvent;
  }

  async remove(id: number) {
    const [deletedEvent] = await this.db
      .delete(schema.seizureEvents)
      .where(eq(schema.seizureEvents.id, id))
      .returning();

    if (!deletedEvent) {
      throw new NotFoundException('Seizure event not found');
    }

    return deletedEvent;
  }

  async replaceSessionEvents(
    sessionId: number,
    events: Array<{ startTimeSeconds: number; endTimeSeconds: number }>,
  ) {
    await this.db.transaction(async (tx) => {
      await tx
        .delete(schema.seizureEvents)
        .where(eq(schema.seizureEvents.sessionId, sessionId));

      if (events.length === 0) {
        return;
      }

      await tx.insert(schema.seizureEvents).values(
        events.map((event) => ({
          sessionId,
          onsetSide: null,
          onsetRegion: null,
          startTimeSeconds: event.startTimeSeconds,
          endTimeSeconds: event.endTimeSeconds,
        })),
      );
    });
  }

  async getPatientAnalytics(
    patientId: number,
    currentUserId: number,
    role: Roles,
    days: number,
    page: number,
    limit: number,
  ) {
    await this.ensureAccess(patientId, currentUserId, role);

    const safeDays = days > 0 ? days : 90;
    const safePage = page > 0 ? page : 1;
    const safeLimit = limit > 0 && limit <= 100 ? limit : 10;

    const endDate = new Date();
    endDate.setUTCHours(23, 59, 59, 999);

    const startDate = new Date(endDate);
    startDate.setUTCHours(0, 0, 0, 0);
    startDate.setUTCDate(startDate.getUTCDate() - (safeDays - 1));

    const sessions = (await this.db
      .select({
        id: schema.sessions.id,
        status: schema.sessions.status,
        filePath: schema.sessions.filePath,
        createdAt: schema.sessions.createdAt,
      })
      .from(schema.sessions)
      .where(eq(schema.sessions.patientId, patientId))
      .orderBy(desc(schema.sessions.createdAt), desc(schema.sessions.id))) as AnalyticsSession[];

    const sessionsInRange = sessions.filter((session) => {
      if (!session.createdAt) {
        return false;
      }

      return session.createdAt >= startDate && session.createdAt <= endDate;
    });

    const analyzedSessions = sessionsInRange.filter(
      (session) => session.status === 'analyzed',
    );
    const analyzedSessionIds = analyzedSessions.map((session) => session.id);

    const eventRows = analyzedSessionIds.length
      ? ((await this.db
          .select({
            eventId: schema.seizureEvents.id,
            sessionId: schema.seizureEvents.sessionId,
            sessionDate: schema.sessions.createdAt,
            filePath: schema.sessions.filePath,
            startTimeSeconds: schema.seizureEvents.startTimeSeconds,
            endTimeSeconds: schema.seizureEvents.endTimeSeconds,
          })
          .from(schema.seizureEvents)
          .innerJoin(
            schema.sessions,
            eq(schema.seizureEvents.sessionId, schema.sessions.id),
          )
          .where(inArray(schema.seizureEvents.sessionId, analyzedSessionIds))
          .orderBy(
            desc(schema.sessions.createdAt),
            desc(schema.seizureEvents.startTimeSeconds),
            desc(schema.seizureEvents.id),
          )) as AnalyticsEvent[])
      : [];

    const eventItems = eventRows.map((event) => ({
      ...event,
      durationSeconds: Math.max(
        0,
        event.endTimeSeconds - event.startTimeSeconds,
      ),
      fileName: event.filePath ? basename(event.filePath) : `session-${event.sessionId}.edf`,
    }));

    const summary = {
      totalSeizures: eventItems.length,
      avgDurationSeconds:
        eventItems.length === 0
          ? 0
          : Math.round(
              eventItems.reduce(
                (sum, event) => sum + event.durationSeconds,
                0,
              ) / eventItems.length,
            ),
      sessionsWithSeizures: new Set(eventItems.map((event) => event.sessionId)).size,
      maxDailySeizures: 0,
      analyzedSessions: analyzedSessions.length,
      processingSessions: sessionsInRange.filter(
        (session) => session.status === 'processing',
      ).length,
      failedSessions: sessionsInRange.filter((session) => session.status === 'failed')
        .length,
    };

    const trendDates = this.createDateSeries(startDate, endDate);
    const trendCountMap = new Map<string, number>(
      trendDates.map((date) => [date, 0]),
    );

    for (const event of eventItems) {
      if (!event.sessionDate) {
        continue;
      }

      const key = this.toDateKey(event.sessionDate);
      trendCountMap.set(key, (trendCountMap.get(key) ?? 0) + 1);
    }

    const trend = trendDates.map((date) => ({
      date,
      seizureCount: trendCountMap.get(date) ?? 0,
    }));

    summary.maxDailySeizures = trend.reduce(
      (max, item) => Math.max(max, item.seizureCount),
      0,
    );

    const sessionCounts = new Map<number, { count: number; fileName: string; sessionDate: string | null }>();
    for (const event of eventItems) {
      const entry = sessionCounts.get(event.sessionId) ?? {
        count: 0,
        fileName: event.fileName,
        sessionDate: event.sessionDate ? event.sessionDate.toISOString() : null,
      };
      entry.count += 1;
      sessionCounts.set(event.sessionId, entry);
    }

    let busiestSession: {
      sessionId: number;
      fileName: string;
      seizureCount: number;
      sessionDate: string | null;
    } | null = null;

    for (const [sessionId, info] of sessionCounts.entries()) {
      if (!busiestSession || info.count > busiestSession.seizureCount) {
        busiestSession = {
          sessionId,
          fileName: info.fileName,
          seizureCount: info.count,
          sessionDate: info.sessionDate,
        };
      }
    }

    const longestEvent =
      eventItems.length === 0
        ? null
        : eventItems.reduce((longest, event) =>
            event.durationSeconds > longest.durationSeconds ? event : longest,
          );

    const durationDistribution = eventItems.reduce(
      (acc, event) => {
        if (event.durationSeconds < 60) {
          acc.low += 1;
        } else if (event.durationSeconds <= 180) {
          acc.med += 1;
        } else {
          acc.high += 1;
        }
        return acc;
      },
      { high: 0, med: 0, low: 0 },
    );

    const totalRecentEvents = eventItems.length;
    const offset = (safePage - 1) * safeLimit;
    const recentEvents = eventItems.slice(offset, offset + safeLimit).map((event) => ({
      eventId: event.eventId,
      sessionId: event.sessionId,
      sessionDate: event.sessionDate ? event.sessionDate.toISOString() : null,
      fileName: event.fileName,
      startTimeSeconds: event.startTimeSeconds,
      endTimeSeconds: event.endTimeSeconds,
      durationSeconds: event.durationSeconds,
    }));

    return {
      summary,
      trend,
      patterns: {
        busiestSession,
        longestEvent: longestEvent
          ? {
              eventId: longestEvent.eventId,
              durationSeconds: longestEvent.durationSeconds,
              sessionId: longestEvent.sessionId,
              fileName: longestEvent.fileName,
              sessionDate: longestEvent.sessionDate
                ? longestEvent.sessionDate.toISOString()
                : null,
            }
          : null,
      },
      durationDistribution,
      recentEvents,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total: totalRecentEvents,
        totalPages: Math.ceil(totalRecentEvents / safeLimit),
      },
    };
  }
}
