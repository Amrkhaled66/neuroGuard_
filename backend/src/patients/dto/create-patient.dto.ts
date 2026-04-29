import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { genderEnum } from 'src/db/schemas/enums';
import { CommonUserDto } from 'src/common/dto/user.dto';

export class CreatePatientDto extends CommonUserDto {
  @IsString()
  @IsNotEmpty()
  medicalId!: string;

  @IsNotEmpty()
  @IsDateString()
  birthDate!: string;

  @IsNotEmpty()
  @IsEnum(genderEnum.enumValues)
  gender!: (typeof genderEnum.enumValues)[number];
}
