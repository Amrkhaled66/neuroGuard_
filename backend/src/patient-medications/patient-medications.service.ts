import {
  ForbiddenException,
  Injectable,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { CreatePatientMedicationDto } from './dto/create-patient-medication.dto';
import { UpdatePatientMedicationDto } from './dto/update-patient-medication.dto';
import { db } from 'src/db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/db/index';
import { eq, and, desc, inArray } from 'drizzle-orm';
import { Roles } from 'src/common/enums/roles.enum';

@Injectable()
export class PatientMedicationsService {
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

  private async getMedicationWithRelations(patientId: number) {
    const medications = await this.db
      .select({
        id: schema.patientMedications.id,
        patientId: schema.patientMedications.patientId,
        medicationId: schema.patientMedications.medicationId,
        dosage: schema.patientMedications.dosage,
        instruction: schema.patientMedications.instruction,
        scheduledTime: schema.patientMedications.scheduledTime,
        startDate: schema.patientMedications.startDate,
        endDate: schema.patientMedications.endDate,
        status: schema.patientMedications.status,
        name: schema.medications.name,
        form: schema.medications.form,
      })
      .from(schema.patientMedications)
      .innerJoin(
        schema.medications,
        eq(schema.patientMedications.medicationId, schema.medications.id),
      )
      .where(eq(schema.patientMedications.patientId, patientId))
      .orderBy(desc(schema.patientMedications.id));

    const medicationIds = medications.map((medication) => medication.id);

    const logs = medicationIds.length
      ? await this.db
          .select({
            id: schema.medicationLogs.id,
            patientMedicationId: schema.medicationLogs.patientMedicationId,
            status: schema.medicationLogs.status,
            takenAt: schema.medicationLogs.takenAt,
          })
          .from(schema.medicationLogs)
          .where(inArray(schema.medicationLogs.patientMedicationId, medicationIds))
          .orderBy(
            desc(schema.medicationLogs.takenAt),
            desc(schema.medicationLogs.id),
          )
      : [];

    const logsByMedicationId = new Map<
      number,
      Array<{
        id: number;
        status: 'scheduled' | 'taken' | 'missed';
        takenAt: string | null;
      }>
    >();

    for (const log of logs) {
      const items = logsByMedicationId.get(log.patientMedicationId) ?? [];
      items.push({
        id: log.id,
        status: log.status,
        takenAt: log.takenAt ? log.takenAt.toISOString() : null,
      });
      logsByMedicationId.set(log.patientMedicationId, items);
    }

    return medications.map((medication) => {
      const medicationLogs = logsByMedicationId.get(medication.id) ?? [];
      const takenCount = medicationLogs.filter((log) => log.status === 'taken').length;
      const missedCount = medicationLogs.filter(
        (log) => log.status === 'missed',
      ).length;
      const scheduledCount = medicationLogs.filter(
        (log) => log.status === 'scheduled',
      ).length;
      const actionable = takenCount + missedCount;

      return {
        ...medication,
        logs: medicationLogs,
        recentLogs: medicationLogs.slice(0, 5),
        adherence: {
          takenCount,
          missedCount,
          scheduledCount,
          adherenceRate:
            actionable === 0 ? 0 : Math.round((takenCount / actionable) * 100),
        },
      };
    });
  }

  async create(
    patientId: number,
    currentUserId: number,
    role: Roles,
    createPatientMedicationDto: CreatePatientMedicationDto,
  ) {
    await this.ensureAccess(patientId, currentUserId, role);

    const {
      medicationId,
      dosage,
      instruction,
      scheduledTime,
      startDate,
      endDate,
      status,
    } = createPatientMedicationDto;

    const [patientMedication] = await this.db
      .insert(schema.patientMedications)
      .values({
        patientId,
        medicationId,
        dosage,
        instruction,
        scheduledTime,
        startDate: startDate ? new Date(startDate).toISOString().split('T')[0] : undefined,
        endDate: endDate ? new Date(endDate).toISOString().split('T')[0] : undefined,
        status,
      })
      .returning();
    return patientMedication;
  }

  async findAllByPatient(
    patientId: number,
    currentUserId: number,
    role: Roles,
  ) {
    await this.ensureAccess(patientId, currentUserId, role);
    return this.getMedicationWithRelations(patientId);
  }

  async findOne(
    patientId: number,
    patientMedicationId: number,
    currentUserId: number,
    role: Roles,
  ) {
    await this.ensureAccess(patientId, currentUserId, role);
    const [patientMedication] = (
      await this.getMedicationWithRelations(patientId)
    ).filter((medication) => medication.id === patientMedicationId);

    if (!patientMedication) {
      throw new NotFoundException('Patient medication not found');
    }
    return patientMedication;
  }

  async update(
    patientId: number,
    patientMedicationId: number,
    currentUserId: number,
    role: Roles,
    updatePatientMedicationDto: UpdatePatientMedicationDto,
  ) {
    await this.ensureAccess(patientId, currentUserId, role);

    const {
      medicationId,
      dosage,
      instruction,
      scheduledTime,
      startDate,
      endDate,
      status,
    } =
      updatePatientMedicationDto;

    const [patientMedication] = await this.db
      .update(schema.patientMedications)
      .set({
        medicationId,
        dosage,
        instruction,
        scheduledTime,
        startDate: startDate
          ? new Date(startDate).toISOString().split('T')[0]
          : undefined,
        endDate: endDate ? new Date(endDate).toISOString().split('T')[0] : undefined,
        status,
      })
      .where(
        and(
          eq(schema.patientMedications.patientId, patientId),
          eq(schema.patientMedications.id, patientMedicationId),
        ),
      )
      .returning();
    if (!patientMedication) {
      throw new NotFoundException('Patient medication not found');
    }
    return patientMedication;
  }

  async remove(
    patientId: number,
    patientMedicationId: number,
    currentUserId: number,
    role: Roles,
  ) {
    await this.ensureAccess(patientId, currentUserId, role);

    const result = await this.db
      .delete(schema.patientMedications)
      .where(
        and(
          eq(schema.patientMedications.patientId, patientId),
          eq(schema.patientMedications.id, patientMedicationId),
        ),
      )
      .returning();
    if (result.length === 0) {
      throw new NotFoundException('Patient medication not found');
    }
    return { success: true };
  }

  async getAdherenceSummary(
    patientId: number,
    currentUserId: number,
    role: Roles,
    days: number,
  ) {
    await this.ensureAccess(patientId, currentUserId, role);

    const safeDays = days > 0 ? days : 7;
    const medications = await this.getMedicationWithRelations(patientId);

    const endDate = new Date();
    endDate.setUTCHours(23, 59, 59, 999);
    const startDate = new Date(endDate);
    startDate.setUTCHours(0, 0, 0, 0);
    startDate.setUTCDate(startDate.getUTCDate() - (safeDays - 1));

    const dateSeries: string[] = [];
    const cursor = new Date(startDate);
    while (cursor <= endDate) {
      dateSeries.push(cursor.toISOString().slice(0, 10));
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    const trendMap = new Map(
      dateSeries.map((date) => [date, { date, taken: 0, missed: 0 }]),
    );

    let takenCount = 0;
    let missedCount = 0;
    let scheduledCount = 0;

    for (const medication of medications) {
      for (const log of medication.logs) {
        if (!log.takenAt) {
          continue;
        }

        const takenAt = new Date(log.takenAt);
        if (Number.isNaN(takenAt.getTime()) || takenAt < startDate || takenAt > endDate) {
          continue;
        }

        const dateKey = takenAt.toISOString().slice(0, 10);
        const trendPoint = trendMap.get(dateKey);
        if (!trendPoint) {
          continue;
        }

        if (log.status === 'taken') {
          trendPoint.taken += 1;
          takenCount += 1;
        } else if (log.status === 'missed') {
          trendPoint.missed += 1;
          missedCount += 1;
        } else if (log.status === 'scheduled') {
          scheduledCount += 1;
        }
      }
    }

    const actionable = takenCount + missedCount;

    return {
      summary: {
        totalMedications: medications.length,
        activeMedications: medications.filter(
          (medication) => medication.status === 'active',
        ).length,
        takenCount,
        missedCount,
        scheduledCount,
        adherenceRate:
          actionable === 0 ? 0 : Math.round((takenCount / actionable) * 100),
      },
      trend: dateSeries.map((date) => trendMap.get(date)!),
      items: medications,
    };
  }
}
