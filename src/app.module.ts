import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from './post/post.module';
import { Post } from './post/entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '21252711',
      database: 'db_personalblog',
      entities: [Post],
      synchronize: true,
    }),
    PostModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
