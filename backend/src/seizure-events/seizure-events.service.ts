import { Injectable, Inject } from '@nestjs/common';
import { CreateSeizureEventDto } from './dto/create-seizure-event.dto';
import { UpdateSeizureEventDto } from './dto/update-seizure-event.dto';
import { db } from 'src/db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/db/index';
import { inArray, sql } from 'drizzle-orm';

@Injectable()
export class SeizureEventsService {
  constructor(@Inject(db) private readonly db: NodePgDatabase<typeof schema>) {}

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
    // Resource created, logic to be implemented
  }

  async findAll() {
    // Resource created, logic to be implemented
  }

  async findOne(id: number) {
    // Resource created, logic to be implemented
  }

  async update(id: number, updateSeizureEventDto: UpdateSeizureEventDto) {
    // Resource created, logic to be implemented
  }

  async remove(id: number) {
    // Resource created, logic to be implemented
  }
}
