import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateSeizureEventDto {
  @IsNumber()
  @IsNotEmpty()
  sessionId!: number;

  @IsString()
  @IsOptional()
  onsetSide?: string;

  @IsString()
  @IsOptional()
  onsetRegion?: string;

  @IsDateString()
  @IsNotEmpty()
  startTime!: string;

  @IsDateString()
  @IsNotEmpty()
  endTime!: string;
}
