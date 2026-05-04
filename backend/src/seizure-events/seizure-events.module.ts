import { Module } from '@nestjs/common';
import { SeizureEventsService } from './seizure-events.service';
import { SeizureEventsController } from './seizure-events.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [SeizureEventsController],
  providers: [SeizureEventsService],
  exports: [SeizureEventsService],
})
export class SeizureEventsModule {}
