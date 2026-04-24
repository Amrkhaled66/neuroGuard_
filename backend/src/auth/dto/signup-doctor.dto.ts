import { IsNotEmpty, IsString } from 'class-validator';
import { SignupUserDto } from './create-user.dto';

export class SignupDoctorDto extends SignupUserDto {
  @IsString()
  @IsNotEmpty()
  clinicName: string;
}
