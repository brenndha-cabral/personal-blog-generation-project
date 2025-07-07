import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Post } from '../../post/entities/post.entity';
import { Theme } from '../../theme/entities/theme.entity';
import { User } from '../../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DevService implements TypeOrmOptionsFactory {
  constructor(private readonly config: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.config.get<'mysql'>('DATABASE_DIALECT'),
      host: this.config.get<string>('DATABASE_HOST'),
      port: this.config.get<number>('DATABASE_PORT'),
      username: this.config.get<string>('DATABASE_USER'),
      password: this.config.get<string>('DATABASE_PASSWORD'),
      database: this.config.get<string>('DATABASE_NAME'),
      entities: [Post, Theme, User],
      synchronize: true,
    };
  }
}
