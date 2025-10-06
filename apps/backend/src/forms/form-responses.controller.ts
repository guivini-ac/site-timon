import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FormsService } from './forms.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateFormResponseDto } from './dto/create-form-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('forms')
@Controller('forms/:formId/responses')
export class FormResponsesController {
  constructor(private readonly formsService: FormsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  list(@Param('formId') formId: string, @Query() query: PaginationQueryDto) {
    return this.formsService.listResponses(formId, query);
  }

  @Post()
  submit(
    @Param('formId') formId: string,
    @Body() dto: CreateFormResponseDto,
  ) {
    return this.formsService.submitResponse(formId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('formId') formId: string, @Param('id') id: string) {
    return this.formsService.deleteResponse(formId, id);
  }
}
