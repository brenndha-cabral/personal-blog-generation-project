import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { Post as PostEntity } from '../entities/post.entity';
import { PostService } from '../services/post.service';

@Controller('/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<PostEntity[]> {
    return this.postService.findAll();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
    return this.postService.findById(id);
  }

  @Get('/:title')
  @HttpCode(HttpStatus.OK)
  findByAllTitles(@Param('title') title: string): Promise<PostEntity[]> {
    return this.postService.findByAllTitles(title);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() post: PostEntity): Promise<PostEntity> {
    return this.postService.create(post);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  update(@Body() post: PostEntity): Promise<PostEntity> {
    return this.postService.update(post);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.postService.delete(id);
  }
}
