import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateSeizureEventDto {
  @IsString()
  @IsOptional()
  onsetSide?: string;

  @IsString()
  @IsOptional()
  onsetRegion?: string;

  @IsNumber()
  @IsOptional()
  startTimeSeconds?: number;

  @IsNumber()
  @IsOptional()
  endTimeSeconds?: number;
}
