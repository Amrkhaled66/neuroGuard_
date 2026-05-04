import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { DbModule } from 'src/db/db.module';
import { SeizureEventsModule } from 'src/seizure-events/seizure-events.module';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [DbModule, SeizureEventsModule, AuthModule],
  controllers: [SessionsController],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
