import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from './post/models/post.module';
import { Post } from './post/entities/post.entity';
import { Theme } from './theme/entities/theme.entity';
import { ThemeModule } from './theme/models/theme.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: config.get<'mysql'>('DATABASE_TYPE'),
        host: config.get<string>('DATABASE_HOST'),
        port: config.get<number>('DATABASE_PORT'),
        username: config.get<string>('DATABASE_USER'),
        password: config.get<string>('DATABASE_PASSWORD'),
        database: config.get<string>('DATABASE_NAME'),
        entities: [Post, Theme, User],
        synchronize: true,
      }),
    }),
    PostModule,
    ThemeModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
