import { JwtService } from '@nestjs/jwt';

import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import bcrypt from 'bcrypt';

import { CreateDoctorDto } from './dto/create-doctor.dto';
import { LoginDoctorDto } from './dto/login-doctor.dto';
import { LoginPatientDto } from './dto/login-patient.dto';

import { DoctorsService } from 'src/doctors/doctors.service';
import { Roles } from 'src/common/enums/roles.enum';
import { PatientsService } from 'src/patients/patients.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly doctorsService: DoctorsService,
    private readonly patientsService: PatientsService,
  ) {}

  async signupDoctor(createDoctorDto: CreateDoctorDto) {
    const existingUser = await this.doctorsService.findByEmail(
      createDoctorDto.email,
    );

    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    const { firstName, lastName, email, password, clinicName } =
      createDoctorDto;

    const user = await this.doctorsService.create({
      firstName,
      lastName,
      email,
      password,
      clinicName,
    });

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      clinicName: user.clinicName,
    };
  }

  async loginDoctor(body: LoginDoctorDto) {
    const { email, password } = body;
    const doctor = await this.doctorsService.findByEmail(email);

    if (!doctor) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await bcrypt.compare(password, doctor.password);

    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const token = await this.jwtService.signAsync({
      id: doctor.id,
      email: doctor.email,
      role: Roles.DOCTOR,
    });

    return { token };
  }

  async loginPatient(loginPatientDto: LoginPatientDto) {
    const { medicalId, password } = loginPatientDto;
    const patient = await this.patientsService.findByMedicalId(medicalId);

    if (!patient) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const isPasswordValid = await bcrypt.compare(password, patient.password);

    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const token = this.jwtService.sign({
      id: patient.id,
      medicalId: patient.medicalId,
      role: Roles.PATIENT,
    });
    return { token };
  }
}
