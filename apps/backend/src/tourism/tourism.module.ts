import { Module } from '@nestjs/common';
import { TourismService } from './tourism.service';
import { TourismController } from './tourism.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TourismController],
  providers: [TourismService],
})
export class TourismModule {}
