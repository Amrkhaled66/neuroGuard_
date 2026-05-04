import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateSeizureEventDto {
  @IsString()
  @IsOptional()
  onsetSide?: string;

  @IsString()
  @IsOptional()
  onsetRegion?: string;

  @IsDateString()
  @IsOptional()
  startTime?: string;

  @IsDateString()
  @IsOptional()
  endTime?: string;
}
