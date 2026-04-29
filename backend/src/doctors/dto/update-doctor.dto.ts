import { PartialType } from '@nestjs/mapped-types';
import { CreateDoctorDto } from '../../auth/dto/create-doctor.dto';

export class UpdateDoctorDto extends PartialType(CreateDoctorDto) {}
