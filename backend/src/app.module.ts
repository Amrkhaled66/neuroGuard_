import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DoctorsModule } from './doctors/doctors.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [ConfigModule.forRoot(), DoctorsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
