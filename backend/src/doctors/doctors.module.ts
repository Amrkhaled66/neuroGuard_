import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { DbModule } from '../db/db.module';
import { AuthModule } from '../auth/auth.module';
import { forwardRef } from '@nestjs/common';
@Module({
  controllers: [DoctorsController],
  providers: [DoctorsService],
  imports: [DbModule, forwardRef(() => AuthModule)],
  exports:[DoctorsService]
})
export class DoctorsModule {}
