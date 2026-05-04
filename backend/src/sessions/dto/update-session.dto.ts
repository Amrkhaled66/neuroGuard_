import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateSessionDto {
  @IsString()
  @IsOptional()
  filePath?: string;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsNumber()
  @IsOptional()
  channelCount?: number;
}
