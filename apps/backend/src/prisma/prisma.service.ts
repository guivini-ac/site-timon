import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    // This is for testing purposes
    if (process.env.NODE_ENV === 'test') {
      const tables = await this.$queryRaw<Array<{ table_name: string }>>`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        AND table_name != '_prisma_migrations'
      `;

      await this.$transaction([
        this.$executeRaw`SET session_replication_role = replica;`,
        ...tables.map(
          ({ table_name }) => this.$executeRawUnsafe(`DELETE FROM "${table_name}";`)
        ),
        this.$executeRaw`SET session_replication_role = DEFAULT;`,
      ]);
    }
  }
}