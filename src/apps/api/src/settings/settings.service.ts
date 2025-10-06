import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertSettingDto } from './dto/upsert-setting.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const settings = await this.prisma.setting.findMany({
      orderBy: { key: 'asc' },
    });
    return settings.reduce(
      (acc, setting) => ({
        ...acc,
        [setting.key]: setting.value,
      }),
      {},
    );
  }

  async findOne(key: string) {
    const setting = await this.prisma.setting.findUnique({ where: { key } });
    if (!setting) {
      throw new NotFoundException('Configuração não encontrada');
    }
    return setting.value;
  }

  async upsert(key: string, dto: UpsertSettingDto) {
    await this.prisma.setting.upsert({
      where: { key },
      create: { key, value: dto.value },
      update: { value: dto.value },
    });
    return this.findOne(key);
  }

  async remove(key: string) {
    await this.prisma.setting.delete({ where: { key } });
    return { deleted: true };
  }
}
