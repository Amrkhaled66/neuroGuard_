import {
  IsNotEmpty,
  IsString,
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

  @IsNumber()
  @IsNotEmpty()
  startTimeSeconds!: number;

  @IsNumber()
  @IsNotEmpty()
  endTimeSeconds!: number;
}
