import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { DeleteResult, ILike, Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async findAll(): Promise<Post[]> {
    return await this.postRepository.find({
      relations: { theme: true },
    });
  }

  async findById(id: number): Promise<Post> {
    const postById = await this.postRepository.findOne({
      where: { id },
      relations: { theme: true },
    });

    if (!postById) {
      throw new HttpException('Postagem não encontrada', HttpStatus.NOT_FOUND);
    }

    return postById;
  }

  async findByAllTitles(title: string): Promise<Post[]> {
    const postsByTitle = await this.postRepository.find({
      where: { title: ILike(`%${title}%`) },
      relations: { theme: true },
    });

    if (!postsByTitle) {
      throw new HttpException(
        'Postagens não encontradas',
        HttpStatus.NOT_FOUND,
      );
    }

    return postsByTitle;
  }

  async create(post: Post): Promise<Post> {
    return await this.postRepository.save(post);
  }

  async update(post: Post): Promise<Post> {
    await this.findById(post.id);
    return await this.postRepository.save(post);
  }

  async delete(id: number): Promise<DeleteResult> {
    await this.findById(id);
    return await this.postRepository.delete(id);
  }
}
