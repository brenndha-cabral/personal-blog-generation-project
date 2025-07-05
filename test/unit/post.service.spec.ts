/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from '../../src/post/services/post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from '../../src/post/entities/post.entity';
import { UserService } from '../../src/user/services/user.service';
import { ThemeService } from '../../src/theme/services/theme.service';
import { HttpException } from '@nestjs/common';

describe('PostService', () => {
  let service: PostService;
  let postRepository: any;
  let userService: any;
  let themeService: any;

  beforeEach(async () => {
    postRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    userService = {
      findUserById: jest.fn(),
      findByUser: jest.fn(),
    };
    themeService = {
      findById: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        { provide: getRepositoryToken(Post), useValue: postRepository },
        { provide: UserService, useValue: userService },
        { provide: ThemeService, useValue: themeService },
      ],
    }).compile();
    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAllPosts deve retornar todos os posts', async () => {
    postRepository.find.mockResolvedValue([{ id: 1, title: 'Post' }]);
    const result = await service.findAllPosts();
    expect(result).toEqual([{ id: 1, title: 'Post' }]);
  });

  it('findPostById deve lançar exceção se não encontrar', async () => {
    postRepository.findOne.mockResolvedValue(null);
    await expect(service.findPostById(1)).rejects.toBeInstanceOf(HttpException);
  });

  it('findPostById deve retornar post se encontrar', async () => {
    postRepository.findOne.mockResolvedValue({ id: 1, title: 'Post' });
    const result = await service.findPostById(1);
    expect(result).toEqual({ id: 1, title: 'Post' });
  });

  it('findPostsByTitle deve retornar posts pelo título', async () => {
    postRepository.find.mockResolvedValue([{ id: 1, title: 'Post' }]);
    const result = await service.findPostsByTitle('Post');
    expect(result).toEqual([{ id: 1, title: 'Post' }]);
  });

  it('findPostsByTitle deve lançar exceção se não encontrar', async () => {
    postRepository.find.mockResolvedValue(null);
    await expect(service.findPostsByTitle('Nada')).rejects.toBeInstanceOf(
      HttpException,
    );
  });

  it('findPostsByTheme deve retornar posts pelo tema', async () => {
    postRepository.find.mockResolvedValue([
      { id: 1, title: 'Post', theme: { description: 'Tech' } },
    ]);
    const result = await service.findPostsByTheme('Tech');
    expect(result).toEqual([
      { id: 1, title: 'Post', theme: { description: 'Tech' } },
    ]);
  });

  it('findPostsByTheme deve lançar exceção se não encontrar', async () => {
    postRepository.find.mockResolvedValue(null);
    await expect(service.findPostsByTheme('Nada')).rejects.toBeInstanceOf(
      HttpException,
    );
  });

  it('create deve criar um post', async () => {
    themeService.findById.mockResolvedValue({ id: 1 });
    userService.findUserById.mockResolvedValue({ id: 1 });
    postRepository.save.mockResolvedValue({ id: 1, title: 'Novo Post' });
    const result = await service.create({
      theme: { id: 1 },
      user: { id: 1 },
    } as any);
    expect(result).toEqual({ id: 1, title: 'Novo Post' });
  });

  it('update deve atualizar um post', async () => {
    service.findPostById = jest.fn().mockResolvedValue({ id: 1 });
    themeService.findById.mockResolvedValue({ id: 1 });
    userService.findUserById.mockResolvedValue({ id: 1 });
    postRepository.save.mockResolvedValue({ id: 1, title: 'Atualizado' });
    const result = await service.update({
      id: 1,
      theme: { id: 1 },
      user: { id: 1 },
    } as any);
    expect(result).toEqual({ id: 1, title: 'Atualizado' });
  });

  it('update deve lançar exceção se post não existir', async () => {
    service.findPostById = jest.fn().mockImplementation(() => {
      throw new HttpException('Postagem não encontrada', 404);
    });
    await expect(
      service.update({ id: 99, theme: { id: 1 }, user: { id: 1 } } as any),
    ).rejects.toBeInstanceOf(HttpException);
  });

  it('delete deve remover um post', async () => {
    service.findPostById = jest.fn().mockResolvedValue({ id: 1 });
    postRepository.delete.mockResolvedValue({ affected: 1 });
    const result = await service.delete(1);
    expect(result).toEqual({ affected: 1 });
  });

  it('delete deve lançar exceção se post não existir', async () => {
    service.findPostById = jest.fn().mockImplementation(() => {
      throw new HttpException('Postagem não encontrada', 404);
    });
    await expect(service.delete(99)).rejects.toBeInstanceOf(HttpException);
  });
});
