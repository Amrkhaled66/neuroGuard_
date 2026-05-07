import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles as RoleEnum } from 'src/common/enums/roles.enum';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationsService } from './notifications.service';
import { UpdateNotificationStatusDto } from './dto/update-notification-status.dto';

@Controller('patients/:patientId/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([RoleEnum.DOCTOR])
  @Post()
  create(
    @Param('patientId', ParseIntPipe) patientId: number,
    @Body() createNotificationDto: CreateNotificationDto,
    @CurrentUser('id') doctorId: number,
  ) {
    return this.notificationsService.create(
      patientId,
      doctorId,
      createNotificationDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Param('patientId', ParseIntPipe) patientId: number,
    @CurrentUser('id') currentUserId: number,
    @CurrentUser('role') role: RoleEnum,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.notificationsService.findAll(
      patientId,
      currentUserId,
      role,
      page,
      limit,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([RoleEnum.PATIENT])
  @Patch(':notificationId/read-status')
  updateReadStatus(
    @Param('patientId', ParseIntPipe) patientId: number,
    @Param('notificationId', ParseIntPipe) notificationId: number,
    @CurrentUser('id') currentPatientId: number,
    @Body() updateNotificationStatusDto: UpdateNotificationStatusDto,
  ) {
    return this.notificationsService.updateReadStatus(
      patientId,
      notificationId,
      currentPatientId,
      updateNotificationStatusDto,
    );
  }
}
