import { Module } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { FormResponsesController } from './form-responses.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FormsController, FormResponsesController],
  providers: [FormsService],
})
export class FormsModule {}
