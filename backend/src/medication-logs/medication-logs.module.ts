import { Module } from '@nestjs/common';
import { MedicationLogsService } from './medication-logs.service';
import { MedicationLogsController } from './medication-logs.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [MedicationLogsController],
  providers: [MedicationLogsService],
  exports: [MedicationLogsService],
})
export class MedicationLogsModule {}
