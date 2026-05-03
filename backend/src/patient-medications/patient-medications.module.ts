import { Module } from '@nestjs/common';
import { PatientMedicationsService } from './patient-medications.service';
import { PatientMedicationsController } from './patient-medications.controller';
import { DbModule } from 'src/db/db.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DbModule, AuthModule],
  controllers: [PatientMedicationsController],
  providers: [PatientMedicationsService],
  exports: [PatientMedicationsService],
})
export class PatientMedicationsModule {}
