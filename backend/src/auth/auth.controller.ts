import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Post, Body } from '@nestjs/common';

// dto
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { LoginDoctorDto } from './dto/login-doctor.dto';
import { LoginPatientDto } from './dto/login-patient.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // signup
  @Post('signup')
  async signupDoctor(@Body() createDoctorDto: CreateDoctorDto) {
    return await this.authService.signupDoctor(createDoctorDto);
  }

  // login
  @Post('login/doctors')
  async loginDoctor(@Body() loginDoctorDto: LoginDoctorDto) {
    return await this.authService.loginDoctor(loginDoctorDto);
  }

  //login -> patients
  @Post('login/patients')
  async loginPatient(@Body() loginPatientDto: LoginPatientDto) {
    return await this.authService.loginPatient(loginPatientDto);
  }
}
