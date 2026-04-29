import { IsNotEmpty, IsString } from 'class-validator';

export class LoginPatientDto {
  @IsString()
  @IsNotEmpty()
  medicalId!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
