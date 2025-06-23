import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { Post } from '../entities/post.entity';
import { PostService } from '../services/post.service';

@Controller('/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Post[]> {
    return this.postService.findAll();
  }
}
