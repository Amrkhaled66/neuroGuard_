import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SeizureEventsService } from './seizure-events.service';
import { CreateSeizureEventDto } from './dto/create-seizure-event.dto';
import { UpdateSeizureEventDto } from './dto/update-seizure-event.dto';

@Controller('seizure-events')
export class SeizureEventsController {
  constructor(private readonly seizureEventsService: SeizureEventsService) {}

  @Post()
  create(@Body() createSeizureEventDto: CreateSeizureEventDto) {
    return this.seizureEventsService.create(createSeizureEventDto);
  }

  @Get()
  findAll() {
    return this.seizureEventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seizureEventsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSeizureEventDto: UpdateSeizureEventDto,
  ) {
    return this.seizureEventsService.update(+id, updateSeizureEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seizureEventsService.remove(+id);
  }
}
