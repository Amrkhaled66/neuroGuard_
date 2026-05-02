import { Module } from '@nestjs/common';
import { PatientMedicationsService } from './patient-medications.service';
import { PatientMedicationsController } from './patient-medications.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [PatientMedicationsController],
  providers: [PatientMedicationsService],
  exports: [PatientMedicationsService],
})
export class PatientMedicationsModule {}
