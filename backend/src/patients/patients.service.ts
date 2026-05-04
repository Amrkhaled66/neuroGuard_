import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { db } from 'src/db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import bcrypt from 'bcrypt';
import * as schema from 'src/db/index';
import { desc, eq, or, sql } from 'drizzle-orm';

@Injectable()
export class PatientsService {
  constructor(@Inject(db) private readonly db: NodePgDatabase<typeof schema>) {}

  private calculateAge(birthDate: string): number {
    const dob = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age -= 1;
    }

    return age;
  }

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

  async findAll(doctorId: number, page: number, limit: number) {
    const safePage = page > 0 ? page : 1;
    const safeLimit = limit > 0 && limit <= 100 ? limit : 10;
    const offset = (safePage - 1) * safeLimit;

    const [totalResult] = await this.db
      .select({ total: sql<number>`count(*)` })
      .from(schema.patients)
      .where(eq(schema.patients.doctorId, doctorId));

    const patients = await this.db
      .select({
        id: schema.patients.id,
        firstName: schema.patients.firstName,
        lastName: schema.patients.lastName,
        birthDate: schema.patients.birthDate,
        medicalId: schema.patients.medicalId,
        status: schema.patients.status,
        sessionFilesNumber: sql<number>`count(${schema.sessions.id})`,
        lastSessionDate: sql<Date | null>`max(${schema.sessions.createdAt})`,
      })
      .from(schema.patients)
      .leftJoin(
        schema.sessions,
        eq(schema.sessions.patientId, schema.patients.id),
      )
      .where(eq(schema.patients.doctorId, doctorId))
      .groupBy(schema.patients.id)
      .orderBy(
        desc(sql`max(${schema.sessions.createdAt})`),
        desc(schema.patients.id),
      )
      .limit(safeLimit)
      .offset(offset);

    const total = Number(totalResult?.total ?? 0);

    return {
      items: patients.map((patient) => ({
        id: patient.id,
        name: `${patient.firstName} ${patient.lastName}`,
        age: this.calculateAge(patient.birthDate),
        medicalId: patient.medicalId,
        sessionFilesNumber: Number(patient.sessionFilesNumber ?? 0),
        lastSessionDate: patient.lastSessionDate,
        status: patient.status,
      })),
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
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
