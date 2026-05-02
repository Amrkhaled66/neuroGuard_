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
} from '@nestjs/common';
import { PatientMedicationsService } from './patient-medications.service';
import { CreatePatientMedicationDto } from './dto/create-patient-medication.dto';
import { UpdatePatientMedicationDto } from './dto/update-patient-medication.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Roles as RoleEnum } from 'src/common/enums/roles.enum';

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
  ) {
    return this.patientMedicationsService.create(
      patientId,
      createPatientMedicationDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Param('patientId', ParseIntPipe) patientId: number) {
    return this.patientMedicationsService.findAllByPatient(patientId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':medId')
  findOne(
    @Param('patientId', ParseIntPipe) patientId: number,
    @Param('medId', ParseIntPipe) patientMedicationId: number,
  ) {
    return this.patientMedicationsService.findOne(patientId, patientMedicationId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([RoleEnum.DOCTOR])
  @Patch(':medId')
  update(
    @Param('patientId', ParseIntPipe) patientId: number,
    @Param('medId', ParseIntPipe) patientMedicationId: number,
    @Body() updatePatientMedicationDto: UpdatePatientMedicationDto,
  ) {
    return this.patientMedicationsService.update(
      patientId,
      patientMedicationId,
      updatePatientMedicationDto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([RoleEnum.DOCTOR])
  @Delete(':medId')
  remove(
    @Param('patientId', ParseIntPipe) patientId: number,
    @Param('medId', ParseIntPipe) patientMedicationId: number,
  ) {
    return this.patientMedicationsService.remove(patientId, patientMedicationId);
  }
}
