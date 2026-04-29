import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { DbModule } from '../db/db.module';
@Module({
  controllers: [DoctorsController],
  providers: [DoctorsService],
  imports: [DbModule],
  exports:[DoctorsService]
})
export class DoctorsModule {}
