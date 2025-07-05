import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from '../../src/post/controllers/post.controller';
import { PostService } from '../../src/post/services/post.service';

// Mock do PostService
const mockPostService = {
  findAllPosts: jest.fn(),
  findPostById: jest.fn(),
  findPostsByTitle: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('PostController', () => {
  let controller: PostController;
  let service: typeof mockPostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [{ provide: PostService, useValue: mockPostService }],
    }).compile();

    controller = module.get<PostController>(PostController);
    service = module.get(PostService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllPosts deve chamar service.findAllPosts', async () => {
    service.findAllPosts.mockResolvedValue(['post1']);
    const result = await controller.findAllPosts();
    expect(service.findAllPosts).toHaveBeenCalled();
    expect(result).toEqual(['post1']);
  });

  it('findPostById deve chamar service.findPostById', async () => {
    service.findPostById.mockResolvedValue({ id: 1 });
    const result = await controller.findPostById(1);
    expect(service.findPostById).toHaveBeenCalledWith(1);
    expect(result).toEqual({ id: 1 });
  });

  it('findPostById deve propagar erro do service', async () => {
    service.findPostById.mockRejectedValue(new Error('erro'));
    await expect(controller.findPostById(1)).rejects.toThrow('erro');
  });

  it('findPostsByTitle deve chamar service.findPostsByTitle', async () => {
    service.findPostsByTitle.mockResolvedValue(['post2']);
    const result = await controller['findPostsByTitle']('abc');
    expect(service.findPostsByTitle).toHaveBeenCalledWith('abc');
    expect(result).toEqual(['post2']);
  });

  it('create deve chamar service.create', async () => {
    service.create.mockResolvedValue({ id: 2 });
    const dto = { title: 'Novo', theme: { id: 1 }, user: { id: 1 } };
    const result = await controller['create'](dto as any);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 2 });
  });

  it('update deve chamar service.update', async () => {
    service.update.mockResolvedValue({ id: 3 });
    const dto = {
      id: 3,
      title: 'Atualizado',
      theme: { id: 1 },
      user: { id: 1 },
    };
    const result = await controller['update'](dto as any);
    expect(service.update).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 3 });
  });

  it('delete deve chamar service.delete', async () => {
    service.delete.mockResolvedValue({ affected: 1 });
    const result = await controller['delete'](1);
    expect(service.delete).toHaveBeenCalledWith(1);
    expect(result).toEqual({ affected: 1 });
  });
});
