import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { MediaQueryDto } from './dto/media-query.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateMediaDto } from './dto/update-media.dto';
import { BadRequestException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('media')
@Controller('media')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER)
  findAll(@Query() query: MediaQueryDto) {
    return this.mediaService.findAll(query);
  }

  @Post('upload')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 1024 * 1024 * 25 },
    }),
  )
  upload(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
    @Body('folder') folder?: string,
  ) {
    if (!file) {
      throw new BadRequestException('Arquivo é obrigatório');
    }
    return this.mediaService.upload(file, user.id, folder);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  update(@Param('id') id: string, @Body() dto: UpdateMediaDto) {
    return this.mediaService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.mediaService.delete(id);
  }
}
