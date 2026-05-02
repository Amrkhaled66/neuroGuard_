import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MedicationsService } from './medications.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Roles as RoleEnum } from 'src/common/enums/roles.enum';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('medications')
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([RoleEnum.DOCTOR])
  @Post()
  create(
    @Body() createMedicationDto: CreateMedicationDto,
    @CurrentUser('id') doctorId: number,
  ) {
    return this.medicationsService.create(createMedicationDto, doctorId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([RoleEnum.DOCTOR])
  @Get()
  findAll(@CurrentUser('id') doctorId: number) {
    return this.medicationsService.findAll(doctorId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([RoleEnum.DOCTOR])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMedicationDto: UpdateMedicationDto,
    @CurrentUser('id') doctorId: number,
  ) {
    return this.medicationsService.update(+id, doctorId, updateMedicationDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([RoleEnum.DOCTOR])
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('id') doctorId: number) {
    return this.medicationsService.remove(+id, doctorId);
  }
}
