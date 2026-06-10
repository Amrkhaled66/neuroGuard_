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
import { Roles } from 'src/common/enums/roles.enum';

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
  scheduledTime: string | null;
  status: string | null;
};

type PatientOverviewMedication = {
  id: number;
  dosage: string | null;
  frequency: string | null;
  instruction: string | null;
  status: string | null;
  startDate: string | null;
  endDate: string | null;
  scheduledTime: string | null;
  medicationName: string;
  medicationForm: string;
};

type PatientOverviewMedicationLog = {
  id: number;
  patientMedicationId: number;
  status: 'scheduled' | 'taken' | 'missed';
  takenAt: Date | null;
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

  private formatTimeLabel(value: string) {
    const [hoursString, minutesString] = value.split(':');
    const hours = Number(hoursString);
    const minutes = Number(minutesString);

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return value;
    }

    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(2026, 0, 1, hours, minutes));
  }

  private formatNextDoseLabel(date: Date) {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
    const startOfTarget = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const timeLabel = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);

    if (startOfTarget.getTime() === startOfToday.getTime()) {
      return `Today, ${timeLabel}`;
    }

    if (startOfTarget.getTime() === startOfTomorrow.getTime()) {
      return `Tomorrow, ${timeLabel}`;
    }

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  }

  private getNextDoseDate(baseDate: Date, scheduledTime: string) {
    const [hoursString, minutesString] = scheduledTime.split(':');
    const hours = Number(hoursString);
    const minutes = Number(minutesString);
    const doseDate = new Date(baseDate);
    doseDate.setHours(hours, minutes, 0, 0);
    return doseDate;
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

  private async getPatientAccessProfile(patientId: number) {
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

    return patient;
  }

  private async ensurePatientAccess(
    patientId: number,
    currentUserId: number,
    role: Roles,
  ) {
    const patient = await this.getPatientAccessProfile(patientId);

    if (role === Roles.DOCTOR && patient.doctorId !== currentUserId) {
      throw new ForbiddenException('You do not have access to this patient');
    }

    if (role === Roles.PATIENT && patient.id !== currentUserId) {
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
        scheduledTime: schema.patientMedications.scheduledTime,
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
          scheduledTime: item.scheduledTime
            ? this.formatTimeLabel(item.scheduledTime)
            : 'Unscheduled',
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

  async getPatientOverview(patientId: number, currentUserId: number, role: Roles) {
    const patient = await this.ensurePatientAccess(patientId, currentUserId, role);

    const sessions = await this.db
      .select({
        id: schema.sessions.id,
        status: schema.sessions.status,
        duration: schema.sessions.duration,
        createdAt: schema.sessions.createdAt,
      })
      .from(schema.sessions)
      .where(eq(schema.sessions.patientId, patientId))
      .orderBy(desc(schema.sessions.createdAt), desc(schema.sessions.id));

    const sessionIds = sessions.map((session) => session.id);
    const analyzedSessions = sessions.filter(
      (session) => session.status === 'analyzed',
    );

    const seizureEvents = analyzedSessions.length
      ? await this.db
          .select({
            eventId: schema.seizureEvents.id,
            sessionId: schema.seizureEvents.sessionId,
            startTimeSeconds: schema.seizureEvents.startTimeSeconds,
            endTimeSeconds: schema.seizureEvents.endTimeSeconds,
            sessionDate: schema.sessions.createdAt,
          })
          .from(schema.seizureEvents)
          .innerJoin(
            schema.sessions,
            eq(schema.seizureEvents.sessionId, schema.sessions.id),
          )
          .where(
            inArray(
              schema.seizureEvents.sessionId,
              analyzedSessions.map((session) => session.id),
            ),
          )
      : [];

    const patientMedications = (await this.db
      .select({
        id: schema.patientMedications.id,
        dosage: schema.patientMedications.dosage,
        frequency: schema.patientMedications.frequency,
        instruction: schema.patientMedications.instruction,
        status: schema.patientMedications.status,
        startDate: schema.patientMedications.startDate,
        endDate: schema.patientMedications.endDate,
        scheduledTime: schema.patientMedications.scheduledTime,
        medicationName: schema.medications.name,
        medicationForm: schema.medications.form,
      })
      .from(schema.patientMedications)
      .innerJoin(
        schema.medications,
        eq(schema.patientMedications.medicationId, schema.medications.id),
      )
      .where(eq(schema.patientMedications.patientId, patientId))
      .orderBy(desc(schema.patientMedications.id))) as PatientOverviewMedication[];

    const medicationLogs = patientMedications.length
      ? await this.db
          .select({
            id: schema.medicationLogs.id,
            patientMedicationId: schema.medicationLogs.patientMedicationId,
            status: schema.medicationLogs.status,
            takenAt: schema.medicationLogs.takenAt,
          })
          .from(schema.medicationLogs)
          .where(
            inArray(
              schema.medicationLogs.patientMedicationId,
              patientMedications.map((medication) => medication.id),
            ),
          )
          .orderBy(
            desc(schema.medicationLogs.takenAt),
            desc(schema.medicationLogs.id),
          )
      : [] as PatientOverviewMedicationLog[];

    const notifications = await this.db
      .select({
        id: schema.notifications.id,
        title: schema.notifications.title,
        message: schema.notifications.message,
        isRead: schema.notifications.isRead,
        createdAt: schema.notifications.createdAt,
        readAt: schema.notifications.readAt,
      })
      .from(schema.notifications)
      .where(eq(schema.notifications.userId, patientId))
      .orderBy(desc(schema.notifications.createdAt), desc(schema.notifications.id));

    const endDate = new Date();
    endDate.setUTCHours(23, 59, 59, 999);
    const startDate = new Date(endDate);
    startDate.setUTCHours(0, 0, 0, 0);
    startDate.setUTCDate(startDate.getUTCDate() - 6);

    const trendDates: string[] = [];
    const cursor = new Date(startDate);
    while (cursor <= endDate) {
      trendDates.push(cursor.toISOString().slice(0, 10));
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    const trendMap = new Map(trendDates.map((date) => [date, 0]));
    let longestEvent:
      | {
          durationSeconds: number;
          sessionDate: string | null;
        }
      | null = null;

    for (const event of seizureEvents) {
      if (!event.sessionDate) {
        continue;
      }

      const key = event.sessionDate.toISOString().slice(0, 10);
      trendMap.set(key, (trendMap.get(key) ?? 0) + 1);

      const durationSeconds = Math.max(
        0,
        event.endTimeSeconds - event.startTimeSeconds,
      );
      if (!longestEvent || durationSeconds > longestEvent.durationSeconds) {
        longestEvent = {
          durationSeconds,
          sessionDate: event.sessionDate.toISOString(),
        };
      }
    }

    const adherenceWindowStart = new Date();
    adherenceWindowStart.setUTCHours(0, 0, 0, 0);
    adherenceWindowStart.setUTCDate(adherenceWindowStart.getUTCDate() - 6);

    const weeklyLogs = medicationLogs.filter(
      (log) => log.takenAt && log.takenAt >= adherenceWindowStart,
    );
    const takenCount = weeklyLogs.filter((log) => log.status === 'taken').length;
    const missedCount = weeklyLogs.filter(
      (log) => log.status === 'missed',
    ).length;
    const scheduledCount = weeklyLogs.filter(
      (log) => log.status === 'scheduled',
    ).length;
    const actionableLogs = takenCount + missedCount;
    const adherenceRate =
      actionableLogs === 0 ? 0 : Math.round((takenCount / actionableLogs) * 100);

    const lastSession = sessions[0] ?? null;
    const unreadNotifications = notifications.filter(
      (notification) => !notification.isRead,
    ).length;
    const activeMedications = patientMedications.filter(
      (medication) => medication.status === 'active',
    );
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);

    const takenMedicationIdsToday = new Set(
      medicationLogs
        .filter(
          (log) =>
            log.status === 'taken' &&
            log.takenAt &&
            log.takenAt >= startOfToday &&
            log.takenAt < endOfToday,
        )
        .map((log) => log.patientMedicationId),
    );

    const schedulableMedications = activeMedications.filter(
      (medication) => medication.scheduledTime,
    );
    const totalScheduledToday = schedulableMedications.length;
    const takenScheduledToday = schedulableMedications.filter((medication) =>
      takenMedicationIdsToday.has(medication.id),
    ).length;
    const remainingScheduledToday = Math.max(totalScheduledToday - takenScheduledToday, 0);
    const todayProgress = {
      takenCount: takenScheduledToday,
      totalCount: totalScheduledToday,
      remainingCount: remainingScheduledToday,
      completionRatio:
        totalScheduledToday === 0 ? 0 : takenScheduledToday / totalScheduledToday,
    };

    const remainingTodayCandidates = schedulableMedications
      .filter((medication) => !takenMedicationIdsToday.has(medication.id))
      .map((medication) => ({
        medication,
        nextDoseDate: this.getNextDoseDate(now, medication.scheduledTime!),
        isTakenToday: false,
      }))
      .sort((left, right) => left.nextDoseDate.getTime() - right.nextDoseDate.getTime());

    const tomorrowBase = new Date(startOfToday);
    tomorrowBase.setDate(tomorrowBase.getDate() + 1);
    const tomorrowCandidates = schedulableMedications
      .map((medication) => ({
        medication,
        nextDoseDate: this.getNextDoseDate(tomorrowBase, medication.scheduledTime!),
        isTakenToday: takenMedicationIdsToday.has(medication.id),
      }))
      .sort((left, right) => left.nextDoseDate.getTime() - right.nextDoseDate.getTime());

    const nextMedicationCandidate =
      remainingTodayCandidates[0] ?? tomorrowCandidates[0] ?? null;

    return {
      patient: {
        id: patient.id,
        fullName: `${patient.firstName} ${patient.lastName}`,
        medicalId: patient.medicalId,
        age: this.calculateAge(patient.birthDate),
        status: patient.status ?? 'stable',
        physician: `Dr. ${patient.doctorFirstName} ${patient.doctorLastName}`,
      },
      stats: {
        totalSeizures: seizureEvents.length,
        activeMedications: activeMedications.length,
        unreadNotifications,
        lastSessionDate: lastSession?.createdAt
          ? lastSession.createdAt.toISOString()
          : null,
      },
      seizureTrend: trendDates.map((date) => ({
        date,
        seizureCount: trendMap.get(date) ?? 0,
      })),
      medicationAdherence: {
        takenCount,
        missedCount,
        scheduledCount,
        adherenceRate,
      },
      todayProgress,
      recentAlerts: notifications.slice(0, 4).map((notification) => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        isRead: notification.isRead,
        createdAt: notification.createdAt?.toISOString() ?? null,
      })),
      latestSeizureInsight:
        seizureEvents.length === 0
          ? {
              title: 'No recent seizure events',
              description:
                analyzedSessions.length === 0
                  ? 'No analyzed EEG sessions are available yet.'
                  : 'No seizures were recorded in the latest analyzed sessions.',
            }
          : {
              title: `${seizureEvents.length} seizure events recorded`,
              description: longestEvent
                ? `Longest recent event lasted ${Math.round(
                    longestEvent.durationSeconds / 60,
                  )} min on ${
                    longestEvent.sessionDate
                      ? new Date(longestEvent.sessionDate).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                          },
                        )
                      : 'an unknown date'
                  }.`
                : 'Recent seizure data is available.',
            },
      nextMedication: nextMedicationCandidate
        ? {
            id: nextMedicationCandidate.medication.id,
            name: nextMedicationCandidate.medication.medicationName,
            dosage: nextMedicationCandidate.medication.dosage,
            frequency: nextMedicationCandidate.medication.frequency,
            instruction: nextMedicationCandidate.medication.instruction,
            scheduledTime: nextMedicationCandidate.medication.scheduledTime,
            nextDoseAt: nextMedicationCandidate.nextDoseDate.toISOString(),
            nextDoseLabel: this.formatNextDoseLabel(
              nextMedicationCandidate.nextDoseDate,
            ),
            isTakenToday: nextMedicationCandidate.isTakenToday,
          }
        : null,
      monitoringSummary: {
        sessionCount: sessions.length,
        analyzedSessions: analyzedSessions.length,
        totalMonitoringTime: this.formatDurationMinutes(
          sessions.reduce((sum, session) => sum + Number(session.duration ?? 0), 0),
        ),
        latestSessionStatus: lastSession?.status ?? null,
      },
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
