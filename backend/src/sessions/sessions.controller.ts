import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  ParseIntPipe,
  UseGuards,
  Res,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { UploadSingleFile } from 'src/common/interceptor/upload-file.interceptor';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { Response } from 'express';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @UploadSingleFile('file')
  create(
    @Body() createSessionDto: CreateSessionDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.sessionsService.create(createSessionDto, file?.path);
  }

  @Get()
  findAll() {
    return this.sessionsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('patient/:patientId')
  findAllByPatient(@Param('patientId', ParseIntPipe) patientId: number) {
    return this.sessionsService.findAllByPatient(patientId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/download')
  async download(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const { filePath, fileName } = await this.sessionsService.getDownloadInfo(
      id,
    );

    return res.download(filePath, fileName);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sessionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    return this.sessionsService.update(id, updateSessionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sessionsService.remove(id);
  }
}
