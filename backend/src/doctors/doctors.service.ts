import { Inject, Injectable } from '@nestjs/common';
import { CreateDoctorDto } from '../auth/dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { db } from 'src/db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { desc, eq, inArray } from 'drizzle-orm';
import * as schema from 'src/db/index';
import bcrypt from 'bcrypt';

type DashboardPatient = {
  id: number;
  firstName: string;
  lastName: string;
  medicalId: string;
  status: 'stable' | 'monitoring' | 'critical' | null;
};

type DashboardSession = {
  id: number;
  patientId: number;
  status: string;
  createdAt: Date | null;
};

type DashboardEvent = {
  id: number;
  sessionId: number;
  patientId: number;
  sessionDate: Date | null;
};

@Injectable()
export class DoctorsService {
  constructor(@Inject(db) private readonly db: NodePgDatabase<typeof schema>) {}

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

  async create(doctorData: CreateDoctorDto) {
    const { firstName, lastName, email, password, clinicName } = doctorData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [newDoctor] = await this.db
      .insert(schema.doctors)
      .values({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        clinicName,
      })
      .returning();
    return newDoctor;
  }

  findAll() {
    return `This action returns all doctors`;
  }

  findOne(id: number) {
    return `This action returns a #${id} doctor`;
  }

  update(id: number, updateDoctorDto: UpdateDoctorDto) {
    return `This action updates a #${id} doctor`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctor`;
  }

  async findByEmail(email: string) {
    const [user] = await this.db
      .select()
      .from(schema.doctors)
      .where(eq(schema.doctors.email, email));
    return user;
  }

  async getDashboard(doctorId: number, days: number) {
    const safeDays = days > 0 ? days : 7;

    const endDate = new Date();
    endDate.setUTCHours(23, 59, 59, 999);

    const startDate = new Date(endDate);
    startDate.setUTCHours(0, 0, 0, 0);
    startDate.setUTCDate(startDate.getUTCDate() - (safeDays - 1));

    const patients = (await this.db
      .select({
        id: schema.patients.id,
        firstName: schema.patients.firstName,
        lastName: schema.patients.lastName,
        medicalId: schema.patients.medicalId,
        status: schema.patients.status,
      })
      .from(schema.patients)
      .where(eq(schema.patients.doctorId, doctorId))) as DashboardPatient[];

    const trendDates = this.createDateSeries(startDate, endDate);
    const trendCountMap = new Map<string, number>(
      trendDates.map((date) => [date, 0]),
    );

    if (patients.length === 0) {
      return {
        summary: {
          totalPatients: 0,
          activeSessions: 0,
          eegFiles: 0,
          criticalAlerts: 0,
          dailyFrequency: 0,
          lastDetectionTime: null,
          criticalPatientsCount: 0,
        },
        trend: trendDates.map((date) => ({
          date,
          seizureCount: 0,
        })),
        criticalPatients: [],
      };
    }

    const patientIds = patients.map((patient) => patient.id);

    const sessions = (await this.db
      .select({
        id: schema.sessions.id,
        patientId: schema.sessions.patientId,
        status: schema.sessions.status,
        createdAt: schema.sessions.createdAt,
      })
      .from(schema.sessions)
      .where(inArray(schema.sessions.patientId, patientIds))
      .orderBy(desc(schema.sessions.createdAt), desc(schema.sessions.id))) as DashboardSession[];

    const lastSessionDateByPatient = new Map<number, string | null>();
    for (const session of sessions) {
      if (!lastSessionDateByPatient.has(session.patientId)) {
        lastSessionDateByPatient.set(
          session.patientId,
          session.createdAt ? session.createdAt.toISOString() : null,
        );
      }
    }

    const analyzedSessionIds = sessions
      .filter(
        (session) =>
          session.status === 'analyzed' &&
          !!session.createdAt &&
          session.createdAt >= startDate &&
          session.createdAt <= endDate,
      )
      .map((session) => session.id);

    const recentEvents = analyzedSessionIds.length
      ? ((await this.db
          .select({
            id: schema.seizureEvents.id,
            sessionId: schema.seizureEvents.sessionId,
            patientId: schema.sessions.patientId,
            sessionDate: schema.sessions.createdAt,
          })
          .from(schema.seizureEvents)
          .innerJoin(
            schema.sessions,
            eq(schema.seizureEvents.sessionId, schema.sessions.id),
          )
          .where(inArray(schema.seizureEvents.sessionId, analyzedSessionIds))) as DashboardEvent[])
      : [];

    const seizureCountInRangeByPatient = new Map<number, number>();
    for (const event of recentEvents) {
      if (!event.sessionDate) {
        continue;
      }

      const dateKey = this.toDateKey(event.sessionDate);
      trendCountMap.set(dateKey, (trendCountMap.get(dateKey) ?? 0) + 1);
      seizureCountInRangeByPatient.set(
        event.patientId,
        (seizureCountInRangeByPatient.get(event.patientId) ?? 0) + 1,
      );
    }

    const [latestDetection] = await this.db
      .select({
        sessionDate: schema.sessions.createdAt,
      })
      .from(schema.seizureEvents)
      .innerJoin(
        schema.sessions,
        eq(schema.seizureEvents.sessionId, schema.sessions.id),
      )
      .innerJoin(
        schema.patients,
        eq(schema.sessions.patientId, schema.patients.id),
      )
      .where(eq(schema.patients.doctorId, doctorId))
      .orderBy(desc(schema.sessions.createdAt), desc(schema.seizureEvents.id))
      .limit(1);

    const trend = trendDates.map((date) => ({
      date,
      seizureCount: trendCountMap.get(date) ?? 0,
    }));

    const criticalPatients = patients
      .filter((patient) => patient.status === 'critical')
      .map((patient) => ({
        id: patient.id,
        name: `${patient.firstName} ${patient.lastName}`,
        medicalId: patient.medicalId,
        status: patient.status ?? 'stable',
        lastSessionDate: lastSessionDateByPatient.get(patient.id) ?? null,
        seizureCountInRange: seizureCountInRangeByPatient.get(patient.id) ?? 0,
      }))
      .sort((a, b) => {
        const dateA = a.lastSessionDate ? new Date(a.lastSessionDate).getTime() : 0;
        const dateB = b.lastSessionDate ? new Date(b.lastSessionDate).getTime() : 0;

        if (dateA !== dateB) {
          return dateB - dateA;
        }

        if (a.seizureCountInRange !== b.seizureCountInRange) {
          return b.seizureCountInRange - a.seizureCountInRange;
        }

        return b.id - a.id;
      });

    return {
      summary: {
        totalPatients: patients.length,
        activeSessions: sessions.filter(
          (session) => session.status === 'processing',
        ).length,
        eegFiles: sessions.length,
        criticalAlerts: criticalPatients.length,
        dailyFrequency: trend[trend.length - 1]?.seizureCount ?? 0,
        lastDetectionTime: latestDetection?.sessionDate
          ? latestDetection.sessionDate.toISOString()
          : null,
        criticalPatientsCount: criticalPatients.length,
      },
      trend,
      criticalPatients,
    };
  }
}
