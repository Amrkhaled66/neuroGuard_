import {
  ForbiddenException,
  Injectable,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { CreateMedicationLogDto } from './dto/create-medication-log.dto';
import { UpdateMedicationLogDto } from './dto/update-medication-log.dto';
import { db } from 'src/db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/db/index';
import { eq, and } from 'drizzle-orm';
import { Roles } from 'src/common/enums/roles.enum';

@Injectable()
export class MedicationLogsService {
  constructor(@Inject(db) private readonly db: NodePgDatabase<typeof schema>) {}

  private async ensureAccess(
    patientId: number,
    patientMedicationId: number,
    currentUserId: number,
    role: Roles,
  ) {
    const [patientMedication] = await this.db
      .select({
        id: schema.patientMedications.id,
        patientId: schema.patientMedications.patientId,
        doctorId: schema.patients.doctorId,
      })
      .from(schema.patientMedications)
      .innerJoin(
        schema.patients,
        eq(schema.patientMedications.patientId, schema.patients.id),
      )
      .where(
        and(
          eq(schema.patientMedications.id, patientMedicationId),
          eq(schema.patientMedications.patientId, patientId),
        ),
      );

    if (!patientMedication) {
      throw new NotFoundException('Patient medication not found');
    }

    if (role === Roles.DOCTOR && patientMedication.doctorId !== currentUserId) {
      throw new ForbiddenException('You do not have access to this patient');
    }

    if (role === Roles.PATIENT && patientId !== currentUserId) {
      throw new ForbiddenException('You do not have access to this patient');
    }

    return patientMedication;
  }

  async create(
    patientId: number,
    medId: number,
    currentUserId: number,
    role: Roles,
    createMedicationLogDto: CreateMedicationLogDto,
  ) {
    await this.ensureAccess(patientId, medId, currentUserId, role);
    const { status } = createMedicationLogDto;

    const [log] = await this.db
      .insert(schema.medicationLogs)
      .values({
        patientMedicationId: medId,
        status,
        takenAt: createMedicationLogDto.takenAt
          ? new Date(createMedicationLogDto.takenAt)
          : new Date(),
      })
      .returning();
    return log;
  }

  async findAllByMedication(
    patientId: number,
    medId: number,
    currentUserId: number,
    role: Roles,
  ) {
    await this.ensureAccess(patientId, medId, currentUserId, role);
    return this.db
      .select()
      .from(schema.medicationLogs)
      .where(eq(schema.medicationLogs.patientMedicationId, medId));
  }

  async findOne(
    patientId: number,
    medId: number,
    logId: number,
    currentUserId: number,
    role: Roles,
  ) {
    await this.ensureAccess(patientId, medId, currentUserId, role);
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
    currentUserId: number,
    role: Roles,
    updateMedicationLogDto: UpdateMedicationLogDto,
  ) {
    await this.ensureAccess(patientId, medId, currentUserId, role);
    const { status } = updateMedicationLogDto;

    const [log] = await this.db
      .update(schema.medicationLogs)
      .set({
        status,
        takenAt: updateMedicationLogDto.takenAt
          ? new Date(updateMedicationLogDto.takenAt)
          : undefined,
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
