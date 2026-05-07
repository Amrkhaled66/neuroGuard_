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
import { SessionsModule } from './sessions/sessions.module';
import { SeizureEventsModule } from './seizure-events/seizure-events.module';
import { NotificationsModule } from './notifications/notifications.module';

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
    SessionsModule,
    SeizureEventsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
