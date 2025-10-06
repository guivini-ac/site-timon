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
import { EventsModule } from './events/events.module';
import { SlidesModule } from './slides/slides.module';
import { GalleriesModule } from './galleries/galleries.module';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';
import { TourismModule } from './tourism/tourism.module';
import { PermissionsModule } from './permissions/permissions.module';
import { SettingsModule } from './settings/settings.module';

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
    EventsModule,
    SlidesModule,
    GalleriesModule,
    CategoriesModule,
    TagsModule,
    TourismModule,
    PermissionsModule,
    SettingsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}