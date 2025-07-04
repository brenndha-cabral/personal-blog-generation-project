import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { ThemeService } from '../../theme/services/theme.service';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private themeService: ThemeService,
    private userService: UserService,
  ) {}

  async findAll(): Promise<Post[]> {
    return await this.postRepository.find({
      relations: { theme: true, user: true },
    });
  }

  async findById(id: number): Promise<Post> {
    const postById = await this.postRepository.findOne({
      where: { id },
      relations: { theme: true, user: true },
    });

    if (!postById) {
      throw new HttpException('Postagem não encontrada', HttpStatus.NOT_FOUND);
    }

    return postById;
  }

  async findByAllTitles(title: string): Promise<Post[]> {
    const postsByTitle = await this.postRepository.find({
      where: { title: ILike(`%${title}%`) },
      relations: { theme: true, user: true },
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
    await this.themeService.findById(post.theme.id);
    await this.userService.findUserById(post.user.id);
    return await this.postRepository.save(post);
  }

  async update(post: Post): Promise<Post> {
    await this.findById(post.id);
    await this.themeService.findById(post.theme.id);
    await this.userService.findUserById(post.user.id);
    return await this.postRepository.save(post);
  }

  async delete(id: number): Promise<DeleteResult> {
    await this.findById(id);
    return await this.postRepository.delete(id);
  }
}
