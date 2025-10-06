import { Module } from '@nestjs/common';
import { SecretariasService } from './secretarias.service';
import { SecretariasController } from './secretarias.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SecretariasController],
  providers: [SecretariasService],
})
export class SecretariasModule {}
