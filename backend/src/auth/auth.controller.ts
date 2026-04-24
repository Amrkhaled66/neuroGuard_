import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDoctorDto } from './dto/signup-doctor.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()

  signup(@Body() signupDoctorDto: SignupDoctorDto) {
    return this.authService.signup(signupDoctorDto);
  }
}
