import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { genderEnum } from 'src/db/schemas/patients.schema';
import { SignupUserDto } from './create-user.dto';

export class SignupPatientDto extends SignupUserDto {
  @IsString()
  @IsNotEmpty()
  medicalId: string;

  @IsNotEmpty()
  @IsDateString()
  birthDate: string;

  @IsNotEmpty()
  @IsEnum(genderEnum.enumValues)
  gender: (typeof genderEnum.enumValues)[number];
}
