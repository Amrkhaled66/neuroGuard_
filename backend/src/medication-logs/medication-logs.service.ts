import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateMedicationLogDto } from './dto/create-medication-log.dto';
import { UpdateMedicationLogDto } from './dto/update-medication-log.dto';
import { db } from 'src/db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/db/index';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class MedicationLogsService {
  constructor(@Inject(db) private readonly db: NodePgDatabase<typeof schema>) {}

  async create(
    patientId: number,
    medId: number,
    createMedicationLogDto: CreateMedicationLogDto,
  ) {
    const { status } = createMedicationLogDto;

    const [log] = await this.db
      .insert(schema.medicationLogs)
      .values({
        patientMedicationId: medId,
        status,
        takenAt: new Date(),
      })
      .returning();
    return log;
  }

  async findAllByMedication(patientId: number, medId: number) {
    return this.db
      .select()
      .from(schema.medicationLogs)
      .where(eq(schema.medicationLogs.patientMedicationId, medId));
  }

  async findOne(patientId: number, medId: number, logId: number) {
    const [log] = await this.db
      .select()
      .from(schema.medicationLogs)
      .where(
        and(
          eq(schema.medicationLogs.patientMedicationId, medId),
          eq(schema.medicationLogs.id, logId),
        ),
      );
    if (!log) {
      throw new NotFoundException('Medication log not found');
    }
    return log;
  }

  async update(
    patientId: number,
    medId: number,
    logId: number,
    updateMedicationLogDto: UpdateMedicationLogDto,
  ) {
    const { status } = updateMedicationLogDto;

    const [log] = await this.db
      .update(schema.medicationLogs)
      .set({
        status,
      })
      .where(
        and(
          eq(schema.medicationLogs.patientMedicationId, medId),
          eq(schema.medicationLogs.id, logId),
        ),
      )
      .returning();
    if (!log) {
      throw new NotFoundException('Medication log not found');
    }
    return log;
  }
}
