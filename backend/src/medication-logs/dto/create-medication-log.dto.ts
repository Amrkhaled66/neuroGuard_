import { IsDateString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { statusEnum } from 'src/db/schemas/enums';
export class CreateMedicationLogDto {
  @IsEnum(statusEnum.enumValues)
  @IsNotEmpty()
  status!: (typeof statusEnum.enumValues)[number];

  @IsOptional()
  @IsDateString()
  takenAt?: string;
}
