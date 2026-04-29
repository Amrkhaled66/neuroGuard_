import { IsNotEmpty, IsString } from 'class-validator';
import { CommonUserDto } from 'src/common/dto/user.dto';

export class CreateDoctorDto extends CommonUserDto {
  @IsString()
  @IsNotEmpty()
  clinicName!: string;
}

