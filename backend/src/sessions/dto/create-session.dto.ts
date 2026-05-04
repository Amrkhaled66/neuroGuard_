import { IsNotEmpty, IsString, IsOptional, IsNumberString } from 'class-validator';

// This file is intentionally left with minimal logic as requested

export class CreateSessionDto {
  @IsNumberString()
  @IsNotEmpty()
  patientId!: string;

  @IsNumberString()
  @IsNotEmpty()
  duration!: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsNumberString()
  @IsNotEmpty()
  channelCount!: string;
}
