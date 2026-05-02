import { Injectable, Inject } from '@nestjs/common';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { db } from 'src/db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/db/index';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class MedicationsService {
  constructor(@Inject(db) private readonly db: NodePgDatabase<typeof schema>) {}

  async create(createMedicationDto: CreateMedicationDto, doctorId: number) {
    const { name, form } = createMedicationDto;
    const [medication] = await this.db
      .insert(schema.medications)
      .values({
        doctorId,
        name,
        form,
      })
      .returning();
    return medication;
  }

  async findAll(doctorId: number) {
    return this.db
      .select()
      .from(schema.medications)
      .where(eq(schema.medications.doctorId, doctorId));
  }

  async findOne(id: number, doctorId: number) {
    const [medication] = await this.db
      .select()
      .from(schema.medications)
      .where(
        and(
          eq(schema.medications.id, id),
          eq(schema.medications.doctorId, doctorId),
        ),
      );
    return medication;
  }

  async update(
    id: number,
    doctorId: number,
    updateMedicationDto: UpdateMedicationDto,
  ) {
    const { name, form } = updateMedicationDto;
    const [medication] = await this.db
      .update(schema.medications)
      .set({
        name,
        form,
      })
      .where(
        and(
          eq(schema.medications.id, id),
          eq(schema.medications.doctorId, doctorId),
        ),
      )
      .returning();
    return medication;
  }

  async remove(id: number, doctorId: number) {
    await this.db
      .delete(schema.medications)
      .where(
        and(
          eq(schema.medications.id, id),
          eq(schema.medications.doctorId, doctorId),
        ),
      );
    return { success: true };
  }
}
