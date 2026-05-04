import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { patientMedicationStatusEnum } from 'src/db/schemas/enums';
export class CreatePatientMedicationDto {
  @IsInt()
  @IsNotEmpty()
  medicationId!: number;

  @IsOptional()
  @IsString()
  dosage?: string;

  @IsOptional()
  @IsString()
  frequency?: string;

  @IsOptional()
  @IsString()
  instruction?: string;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsEnum(patientMedicationStatusEnum.enumValues)
  status?: (typeof patientMedicationStatusEnum.enumValues)[number];
}
