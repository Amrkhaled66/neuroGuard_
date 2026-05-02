import { CreatePatientMedicationDto } from './create-patient-medication.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdatePatientMedicationDto extends PartialType(
  CreatePatientMedicationDto,
) {}
