import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { db } from 'src/db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import bcrypt from 'bcrypt';
import * as schema from 'src/db/index';
import { eq, or } from 'drizzle-orm';

@Injectable()
export class PatientsService {
  constructor(@Inject(db) private readonly db: NodePgDatabase<typeof schema>) {}
  async create(createPatientDto: CreatePatientDto, doctorId: number) {
    const {
      medicalId,
      birthDate,
      gender,
      firstName,
      lastName,
      email,
      password,
    } = createPatientDto;
    const [existingPatient] = await this.db
      .select()
      .from(schema.patients)
      .where(
        or(
          eq(schema.patients.email, email),
          eq(schema.patients.medicalId, medicalId),
        ),
      );

    if (existingPatient) {
      throw new ConflictException(
        'Patient with this email or medical ID already exists',
      );
    }
    const hashedPassword = bcrypt.hashSync(password, 10);

    await this.db.insert(schema.patients).values({
      medicalId,
      birthDate,
      gender,
      firstName,
      doctorId,
      lastName,
      email,
      password: hashedPassword,
    });
    return {
      medicalId,
      email,
      firstName,
      lastName,
    };
  }

  findAll() {
    return `This action returns all patients`;
  }

  findOne(id: number) {
    return `This action returns a #${id} patient`;
  }

  update(id: number, updatePatientDto: UpdatePatientDto) {
    return `This action updates a #${id} patient`;
  }

  remove(id: number) {
    return `This action removes a #${id} patient`;
  }

  async findByMedicalId(medicalId: string) {
    const [patient] = await this.db
      .select()
      .from(schema.patients)
      .where(eq(schema.patients.medicalId, medicalId));
    return patient;
  }
}
