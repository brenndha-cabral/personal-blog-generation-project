import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { PostService } from '../services/post.service';
import { PostController } from '../controllers/post.controller';
import { ThemeModule } from '../../theme/models/theme.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), ThemeModule],
  providers: [PostService],
  controllers: [PostController],
  exports: [],
})
export class PostModule {}
