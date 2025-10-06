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
import { FormsService } from './forms.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('forms')
@Controller('forms')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER)
  findAll(@Query() query: PaginationQueryDto) {
    return this.formsService.findAll(query);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER)
  findOne(@Param('id') id: string) {
    return this.formsService.findById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  create(@Body() dto: CreateFormDto, @CurrentUser() user: any) {
    return this.formsService.create(dto, user.id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  update(@Param('id') id: string, @Body() dto: UpdateFormDto) {
    return this.formsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.formsService.delete(id);
  }
}
