import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { db } from 'src/db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import bcrypt from 'bcrypt';
import * as schema from 'src/db/index';
import { desc, eq, inArray, or, sql } from 'drizzle-orm';

type PatientProfileBase = {
  id: number;
  firstName: string;
  lastName: string;
  medicalId: string;
  birthDate: string;
  gender: 'male' | 'female' | null;
  status: 'stable' | 'monitoring' | 'critical' | null;
  doctorId: number;
  doctorFirstName: string;
  doctorLastName: string;
};

type PatientProfileSession = {
  id: number;
  duration: number;
  status: string;
  createdAt: Date | null;
};

type PatientProfileMedication = {
  id: number;
  name: string;
  dosage: string | null;
  frequency: string | null;
  status: string | null;
};

@Injectable()
export class PatientsService {
  constructor(@Inject(db) private readonly db: NodePgDatabase<typeof schema>) {}

  private calculateAge(birthDate: string): number {
    const dob = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dob.getDate())
    ) {
      age -= 1;
    }

    return age;
  }

  private capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  private formatDurationMinutes(totalMinutes: number) {
    const safeMinutes = Math.max(0, Math.round(totalMinutes));
    const hours = Math.floor(safeMinutes / 60);
    const remainingMinutes = safeMinutes % 60;

    if (hours === 0) {
      return `${remainingMinutes}m`;
    }

    if (remainingMinutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${remainingMinutes}m`;
  }

  private async getPatientForDoctor(patientId: number, doctorId: number) {
    const [patient] = (await this.db
      .select({
        id: schema.patients.id,
        firstName: schema.patients.firstName,
        lastName: schema.patients.lastName,
        medicalId: schema.patients.medicalId,
        birthDate: schema.patients.birthDate,
        gender: schema.patients.gender,
        status: schema.patients.status,
        doctorId: schema.patients.doctorId,
        doctorFirstName: schema.doctors.firstName,
        doctorLastName: schema.doctors.lastName,
      })
      .from(schema.patients)
      .innerJoin(
        schema.doctors,
        eq(schema.patients.doctorId, schema.doctors.id),
      )
      .where(eq(schema.patients.id, patientId))) as PatientProfileBase[];

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    if (patient.doctorId !== doctorId) {
      throw new ForbiddenException('You do not have access to this patient');
    }

    return patient;
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

  async findProfile(patientId: number, doctorId: number) {
    const patient = await this.getPatientForDoctor(patientId, doctorId);

    const sessions = (await this.db
      .select({
        id: schema.sessions.id,
        duration: schema.sessions.duration,
        status: schema.sessions.status,
        createdAt: schema.sessions.createdAt,
      })
      .from(schema.sessions)
      .where(eq(schema.sessions.patientId, patientId))
      .orderBy(
        desc(schema.sessions.createdAt),
        desc(schema.sessions.id),
      )) as PatientProfileSession[];

    const sessionIds = sessions.map((session) => session.id);

    const seizureCounts = sessionIds.length
      ? await this.db
          .select({
            sessionId: schema.seizureEvents.sessionId,
            seizureCount: sql<number>`count(*)`,
          })
          .from(schema.seizureEvents)
          .where(inArray(schema.seizureEvents.sessionId, sessionIds))
          .groupBy(schema.seizureEvents.sessionId)
      : [];

    const totalSeizures = seizureCounts.reduce(
      (sum, entry) => sum + Number(entry.seizureCount ?? 0),
      0,
    );

    const lastSessionDate = sessions[0]?.createdAt ?? null;
    const analyzedSessions = sessions.filter(
      (session) => session.status === 'analyzed',
    ).length;
    const totalMonitoringMinutes = sessions.reduce(
      (sum, session) => sum + Number(session.duration ?? 0),
      0,
    );

    const patientMedications = (await this.db
      .select({
        id: schema.patientMedications.id,
        name: schema.medications.name,
        dosage: schema.patientMedications.dosage,
        frequency: schema.patientMedications.frequency,
        status: schema.patientMedications.status,
      })
      .from(schema.patientMedications)
      .innerJoin(
        schema.medications,
        eq(schema.patientMedications.medicationId, schema.medications.id),
      )
      .where(eq(schema.patientMedications.patientId, patientId))) as PatientProfileMedication[];

    const notifications = await this.db
      .select({
        id: schema.notifications.id,
        title: schema.notifications.title,
        message: schema.notifications.message,
        isRead: schema.notifications.isRead,
      })
      .from(schema.notifications)
      .where(eq(schema.notifications.userId, patientId))
      .orderBy(
        desc(schema.notifications.createdAt),
        desc(schema.notifications.id),
      )
      .limit(4);

    const safeStatus = patient.status ?? 'stable';
    const riskConfig =
      safeStatus === 'critical'
        ? {
            score: 85,
            label: 'High Risk',
            description: 'Critical status requires immediate attention.',
          }
        : safeStatus === 'monitoring'
          ? {
              score: 60,
              label: 'Moderate Risk',
              description: 'Stable but requires close monitoring.',
            }
          : {
              score: 25,
              label: 'Low Risk',
              description: 'Current profile appears stable.',
            };

    return {
      patient: {
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        initials: `${patient.firstName.charAt(0)}${patient.lastName.charAt(0)}`.toUpperCase(),
        medicalId: patient.medicalId,
        birthDate: patient.birthDate,
        age: this.calculateAge(patient.birthDate),
        gender: patient.gender ?? 'male',
        physician: `Dr. ${patient.doctorFirstName} ${patient.doctorLastName}`,
        admissionDate: null,
        status: safeStatus,
      },
      clinicalOverview: [
        { label: 'Status', value: this.capitalize(safeStatus) },
        {
          label: 'Gender',
          value: this.capitalize(patient.gender ?? 'male'),
        },
        { label: 'EEG Sessions', value: String(sessions.length) },
        {
          label: 'Last Session',
          value: lastSessionDate
            ? lastSessionDate.toISOString()
            : 'No sessions yet',
        },
      ],
      medications: patientMedications
        .sort((a, b) => {
          if (a.status === 'active' && b.status !== 'active') return -1;
          if (a.status !== 'active' && b.status === 'active') return 1;
          return a.name.localeCompare(b.name);
        })
        .map((item) => ({
          name: item.name,
          dosage:
            [item.dosage, item.frequency].filter(Boolean).join(' / ') ||
            'Unspecified',
          status: this.capitalize(item.status ?? 'active'),
        })),
      risk: riskConfig,
      alerts: notifications.map((item) => ({
        type: item.isRead ? 'success' : 'warning',
        message: `${item.title}: ${item.message}`,
      })),
      stats: [
        { label: 'Total Seizures', value: String(totalSeizures) },
        { label: 'EEG Sessions', value: String(sessions.length) },
        {
          label: 'Monitoring Time',
          value: this.formatDurationMinutes(totalMonitoringMinutes),
        },
        { label: 'Analyzed Sessions', value: String(analyzedSessions) },
        {
          label: 'Active Medications',
          value: String(
            patientMedications.filter((item) => item.status === 'active').length,
          ),
        },
      ],
      trend: undefined,
    };
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
