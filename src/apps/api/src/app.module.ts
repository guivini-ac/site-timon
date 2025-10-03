import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { PagesModule } from './pages/pages.module';
import { MediaModule } from './media/media.module';
import { FormsModule } from './forms/forms.module';
import { SecretariasModule } from './secretarias/secretarias.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PostsModule,
    PagesModule,
    MediaModule,
    FormsModule,
    SecretariasModule,
    ServicesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}