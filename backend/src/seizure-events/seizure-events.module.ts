import { Module } from '@nestjs/common';
import { SeizureEventsService } from './seizure-events.service';
import { SeizureEventsController } from './seizure-events.controller';
import { DbModule } from 'src/db/db.module';
import { AuthModule } from 'src/auth/auth.module';
import { PatientSeizureAnalyticsController } from './patient-seizure-analytics.controller';

@Module({
  imports: [DbModule, AuthModule],
  controllers: [SeizureEventsController, PatientSeizureAnalyticsController],
  providers: [SeizureEventsService],
  exports: [SeizureEventsService],
})
export class SeizureEventsModule {}
