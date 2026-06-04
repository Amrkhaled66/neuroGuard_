import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Roles as RoleEnum } from 'src/common/enums/roles.enum';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([RoleEnum.DOCTOR])
  @Post()
  create(
    @Body() createPatientDto: CreatePatientDto,
    @CurrentUser('id') doctorId: number,
  ) {
    return this.patientsService.create(createPatientDto, doctorId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([RoleEnum.DOCTOR])
  @Get()
  findAll(
    @CurrentUser('id') doctorId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.patientsService.findAll(doctorId, page, limit);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([RoleEnum.DOCTOR])
  @Get(':id/profile')
  findProfile(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') doctorId: number,
  ) {
    return this.patientsService.findProfile(id, doctorId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([RoleEnum.PATIENT])
  @Get('me/overview')
  getMyOverview(@CurrentUser('id') patientId: number) {
    return this.patientsService.getPatientOverview(
      patientId,
      patientId,
      RoleEnum.PATIENT,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.patientsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientsService.update(+id, updatePatientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientsService.remove(+id);
  }
}
