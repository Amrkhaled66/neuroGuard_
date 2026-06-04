import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { MedicationLogsService } from './medication-logs.service';
import { CreateMedicationLogDto } from './dto/create-medication-log.dto';
import { UpdateMedicationLogDto } from './dto/update-medication-log.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/common/enums/roles.enum';
@Controller('patients/:patientId/medications/:medId/logs')
export class MedicationLogsController {
  constructor(private readonly medicationLogsService: MedicationLogsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Param('patientId',ParseIntPipe) patientId: number,
    @Param('medId',ParseIntPipe) medId: number,
    @CurrentUser('id') currentUserId: number,
    @CurrentUser('role') role: Roles,
    @Body() createMedicationLogDto: CreateMedicationLogDto,
  ) {
    return this.medicationLogsService.create(
      patientId,
      medId,
      currentUserId,
      role,
      createMedicationLogDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Param('patientId',ParseIntPipe) patientId: number,
    @Param('medId',ParseIntPipe) medId: number,
    @CurrentUser('id') currentUserId: number,
    @CurrentUser('role') role: Roles,
  ) {
    return this.medicationLogsService.findAllByMedication(
      patientId,
      medId,
      currentUserId,
      role,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':logId')
  findOne(
    @Param('patientId',ParseIntPipe) patientId: number,
    @Param('medId',ParseIntPipe) medId: number,
    @Param('logId',ParseIntPipe) logId: number,
    @CurrentUser('id') currentUserId: number,
    @CurrentUser('role') role: Roles,
  ) {
    return this.medicationLogsService.findOne(
      patientId,
      medId,
      logId,
      currentUserId,
      role,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':logId')
  update(
    @Param('patientId',ParseIntPipe) patientId: number,
    @Param('medId',ParseIntPipe) medId: number,
    @Param('logId',ParseIntPipe) logId: number,
    @CurrentUser('id') currentUserId: number,
    @CurrentUser('role') role: Roles,
    @Body() updateMedicationLogDto: UpdateMedicationLogDto,
  ) {
    return this.medicationLogsService.update(
      patientId,
      medId,
      logId,
      currentUserId,
      role,
      updateMedicationLogDto,
    );
  }
}
