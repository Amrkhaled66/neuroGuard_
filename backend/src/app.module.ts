import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DoctorsModule } from './doctors/doctors.module';
import { AuthModule } from './auth/auth.module';
import { PatientsModule } from './patients/patients.module';
import { MedicationsModule } from './medications/medications.module';
import { PatientMedicationsModule } from './patient-medications/patient-medications.module';
import { MedicationLogsModule } from './medication-logs/medication-logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DoctorsModule,
    AuthModule,
    PatientsModule,
    MedicationsModule,
    PatientMedicationsModule,
    MedicationLogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
