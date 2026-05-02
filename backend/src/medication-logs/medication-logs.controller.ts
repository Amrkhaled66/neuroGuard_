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
@Controller('patients/:patientId/medications/:medId/logs')
export class MedicationLogsController {
  constructor(private readonly medicationLogsService: MedicationLogsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Param('patientId',ParseIntPipe) patientId: number,
    @Param('medId',ParseIntPipe) medId: number,
    @Body() createMedicationLogDto: CreateMedicationLogDto,
  ) {
    return this.medicationLogsService.create(
      patientId,
      medId,
      createMedicationLogDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Param('patientId',ParseIntPipe) patientId: number,
    @Param('medId',ParseIntPipe) medId: number,
  ) {
    return this.medicationLogsService.findAllByMedication(patientId, medId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':logId')
  findOne(
    @Param('patientId',ParseIntPipe) patientId: number,
    @Param('medId',ParseIntPipe) medId: number,
    @Param('logId',ParseIntPipe) logId: number,
  ) {
    return this.medicationLogsService.findOne(patientId, medId, logId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':logId')
  update(
    @Param('patientId',ParseIntPipe) patientId: number,
    @Param('medId',ParseIntPipe) medId: number,
    @Param('logId',ParseIntPipe) logId: number,
    @Body() updateMedicationLogDto: UpdateMedicationLogDto,
  ) {
    return this.medicationLogsService.update(
      patientId,
      medId,
      logId,
      updateMedicationLogDto,
    );
  }
}
