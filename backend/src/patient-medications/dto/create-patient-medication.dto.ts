import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
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
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'scheduledTime must be in HH:mm format',
  })
  scheduledTime?: string;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsEnum(patientMedicationStatusEnum.enumValues)
  status?: (typeof patientMedicationStatusEnum.enumValues)[number];
}
