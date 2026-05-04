import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreatePatientMedicationDto } from './dto/create-patient-medication.dto';
import { UpdatePatientMedicationDto } from './dto/update-patient-medication.dto';
import { db } from 'src/db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/db/index';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class PatientMedicationsService {
  constructor(@Inject(db) private readonly db: NodePgDatabase<typeof schema>) {}

  async create(
    patientId: number,
    createPatientMedicationDto: CreatePatientMedicationDto,
  ) {
    const {
      medicationId,
      dosage,
      frequency,
      instruction,
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
        frequency,
        instruction,
        startDate: startDate ? new Date(startDate).toISOString().split('T')[0] : undefined,
        endDate: endDate ? new Date(endDate).toISOString().split('T')[0] : undefined,
        status,
      })
      .returning();
    return patientMedication;
  }

  async findAllByPatient(patientId: number) {
    return this.db
      .select()
      .from(schema.patientMedications)
      .where(eq(schema.patientMedications.patientId, patientId));
  }

  async findOne(patientId: number, patientMedicationId: number) {
    const [patientMedication] = await this.db
      .select()
      .from(schema.patientMedications)
      .where(
        and(
          eq(schema.patientMedications.patientId, patientId),
          eq(schema.patientMedications.id, patientMedicationId),
        ),
      );
    if (!patientMedication) {
      throw new NotFoundException('Patient medication not found');
    }
    return patientMedication;
  }

  async update(
    patientId: number,
    patientMedicationId: number,
    updatePatientMedicationDto: UpdatePatientMedicationDto,
  ) {
    const {
      medicationId,
      dosage,
      frequency,
      instruction,
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
        frequency,
        instruction,
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

  async remove(patientId: number, patientMedicationId: number) {
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
}
