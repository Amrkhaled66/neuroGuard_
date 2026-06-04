import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  Query,
} from '@nestjs/common';
import { PatientMedicationsService } from './patient-medications.service';
import { CreatePatientMedicationDto } from './dto/create-patient-medication.dto';
import { UpdatePatientMedicationDto } from './dto/update-patient-medication.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Roles as RoleEnum } from 'src/common/enums/roles.enum';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('patients/:patientId/medications')
export class PatientMedicationsController {
  constructor(
    private readonly patientMedicationsService: PatientMedicationsService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([RoleEnum.DOCTOR])
  @Post()
  create(
    @Param('patientId', ParseIntPipe) patientId: number,
    @Body() createPatientMedicationDto: CreatePatientMedicationDto,
    @CurrentUser('id') doctorId: number,
  ) {
    return this.patientMedicationsService.create(
      patientId,
      doctorId,
      RoleEnum.DOCTOR,
      createPatientMedicationDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('adherence')
  getAdherenceSummary(
    @Param('patientId', ParseIntPipe) patientId: number,
    @CurrentUser('id') currentUserId: number,
    @CurrentUser('role') role: RoleEnum,
    @Query('days', new DefaultValuePipe(7), ParseIntPipe) days: number,
  ) {
    return this.patientMedicationsService.getAdherenceSummary(
      patientId,
      currentUserId,
      role,
      days,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Param('patientId', ParseIntPipe) patientId: number,
    @CurrentUser('id') currentUserId: number,
    @CurrentUser('role') role: RoleEnum,
  ) {
    return this.patientMedicationsService.findAllByPatient(
      patientId,
      currentUserId,
      role,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':medId')
  findOne(
    @Param('patientId', ParseIntPipe) patientId: number,
    @Param('medId', ParseIntPipe) patientMedicationId: number,
    @CurrentUser('id') currentUserId: number,
    @CurrentUser('role') role: RoleEnum,
  ) {
    return this.patientMedicationsService.findOne(
      patientId,
      patientMedicationId,
      currentUserId,
      role,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([RoleEnum.DOCTOR])
  @Patch(':medId')
  update(
    @Param('patientId', ParseIntPipe) patientId: number,
    @Param('medId', ParseIntPipe) patientMedicationId: number,
    @Body() updatePatientMedicationDto: UpdatePatientMedicationDto,
    @CurrentUser('id') doctorId: number,
  ) {
    return this.patientMedicationsService.update(
      patientId,
      patientMedicationId,
      doctorId,
      RoleEnum.DOCTOR,
      updatePatientMedicationDto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([RoleEnum.DOCTOR])
  @Delete(':medId')
  remove(
    @Param('patientId', ParseIntPipe) patientId: number,
    @Param('medId', ParseIntPipe) patientMedicationId: number,
    @CurrentUser('id') doctorId: number,
  ) {
    return this.patientMedicationsService.remove(
      patientId,
      patientMedicationId,
      doctorId,
      RoleEnum.DOCTOR,
    );
  }
}
