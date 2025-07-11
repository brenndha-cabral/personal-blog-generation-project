import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../post/entities/post.entity';
import { PostService } from '../post/services/post.service';
import { PostController } from '../post/controllers/post.controller';
import { ThemeModule } from '../theme/theme.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), ThemeModule, UserModule],
  providers: [PostService],
  controllers: [PostController],
  exports: [],
})
export class PostModule {}
