import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, desc, eq, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Roles } from 'src/common/enums/roles.enum';
import { db } from 'src/db/db.module';
import * as schema from 'src/db/index';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationStatusDto } from './dto/update-notification-status.dto';

@Injectable()
export class NotificationsService {
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

  async create(
    patientId: number,
    doctorId: number,
    createNotificationDto: CreateNotificationDto,
  ) {
    await this.ensureAccess(patientId, doctorId, Roles.DOCTOR);

    const [notification] = await this.db
      .insert(schema.notifications)
      .values({
        userId: patientId,
        title: createNotificationDto.title,
        message: createNotificationDto.message,
      })
      .returning();

    return notification;
  }

  async findAll(
    patientId: number,
    currentUserId: number,
    role: Roles,
    page: number,
    limit: number,
  ) {
    await this.ensureAccess(patientId, currentUserId, role);

    const safePage = page > 0 ? page : 1;
    const safeLimit = limit > 0 && limit <= 100 ? limit : 10;
    const offset = (safePage - 1) * safeLimit;

    const [totalResult, statsResult] = await Promise.all([
      this.db
        .select({ total: sql<number>`count(*)` })
        .from(schema.notifications)
        .where(eq(schema.notifications.userId, patientId)),
      this.db
        .select({
          readCount: sql<number>`count(*) filter (where ${schema.notifications.isRead} = true)`,
          avgResponseTimeInSeconds: sql<number | null>`
            avg(extract(epoch from ${schema.notifications.readAt} - ${schema.notifications.createdAt}))
          `,
        })
        .from(schema.notifications)
        .where(eq(schema.notifications.userId, patientId)),
    ]);

    const items = await this.db
      .select()
      .from(schema.notifications)
      .where(eq(schema.notifications.userId, patientId))
      .orderBy(desc(schema.notifications.createdAt), desc(schema.notifications.id))
      .limit(safeLimit)
      .offset(offset);

    const total = Number(totalResult[0]?.total ?? 0);
    const readCount = Number(statsResult[0]?.readCount ?? 0);
    const avgResponseTimeInSeconds =
      statsResult[0]?.avgResponseTimeInSeconds === null ||
      statsResult[0]?.avgResponseTimeInSeconds === undefined
        ? null
        : Number(statsResult[0].avgResponseTimeInSeconds);

    return {
      items,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
      stats: {
        avgResponseTimeInSeconds,
        patientResponseRate: total === 0 ? 0 : (readCount / total) * 100,
      },
    };
  }

  async updateReadStatus(
    patientId: number,
    notificationId: number,
    currentPatientId: number,
    updateNotificationStatusDto: UpdateNotificationStatusDto,
  ) {
    await this.ensureAccess(patientId, currentPatientId, Roles.PATIENT);

    const [notification] = await this.db
      .update(schema.notifications)
      .set({
        isRead: updateNotificationStatusDto.isRead,
        readAt: updateNotificationStatusDto.isRead ? new Date() : null,
      })
      .where(
          eq(schema.notifications.id, notificationId),
      )
      .returning();

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }
}
