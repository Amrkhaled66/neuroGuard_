import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/enums/roles.enum';
import { SeizureEventsService } from './seizure-events.service';

@Controller('patients/:patientId/seizures')
export class PatientSeizureAnalyticsController {
  constructor(private readonly seizureEventsService: SeizureEventsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('analytics')
  getAnalytics(
    @Param('patientId', ParseIntPipe) patientId: number,
    @CurrentUser('id') currentUserId: number,
    @CurrentUser('role') role: Roles,
    @Query('days', new DefaultValuePipe(90), ParseIntPipe) days: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.seizureEventsService.getPatientAnalytics(
      patientId,
      currentUserId,
      role,
      days,
      page,
      limit,
    );
  }
}
