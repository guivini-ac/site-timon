import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SlidesService } from './slides.service';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { SlidesQueryDto } from './dto/slides-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('slides')
@Controller('slides')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SlidesController {
  constructor(private readonly slidesService: SlidesService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER)
  findAll(@Query() query: SlidesQueryDto) {
    const { active, ...rest } = query;
    return this.slidesService.findAll({
      ...rest,
      active: active !== undefined ? active === 'true' : undefined,
    });
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER)
  findOne(@Param('id') id: string) {
    return this.slidesService.findById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  create(@Body() dto: CreateSlideDto) {
    return this.slidesService.create(dto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  update(@Param('id') id: string, @Body() dto: UpdateSlideDto) {
    return this.slidesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.slidesService.delete(id);
  }
}
