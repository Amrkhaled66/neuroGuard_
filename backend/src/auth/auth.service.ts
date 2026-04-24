import { Injectable } from '@nestjs/common';
import { SignupDoctorDto } from './dto/signup-doctor.dto';

@Injectable()
export class AuthService {
  signup(signupDoctorDto: SignupDoctorDto) {
    return signupDoctorDto;
  }
}
