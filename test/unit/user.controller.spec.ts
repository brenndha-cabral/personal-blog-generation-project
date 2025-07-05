import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../src/user/controllers/user.controller';
import { UserService } from '../../src/user/services/user.service';

const mockUserService = {
  findAll: jest.fn(),
  findUserById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

describe('UserController', () => {
  let controller: UserController;
  let service: typeof mockUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();
    controller = module.get<UserController>(UserController);
    service = module.get(UserService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll deve chamar service.findAll', async () => {
    service.findAll.mockResolvedValue(['user1']);
    const result = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual(['user1']);
  });

  it('findById deve chamar service.findUserById', async () => {
    service.findUserById.mockResolvedValue({ id: 1 });
    const result = await controller.findById(1);
    expect(service.findUserById).toHaveBeenCalledWith(1);
    expect(result).toEqual({ id: 1 });
  });

  it('findById deve propagar erro do service', async () => {
    service.findUserById.mockRejectedValue(new Error('erro'));
    await expect(controller.findById(1)).rejects.toThrow('erro');
  });

  it('create deve chamar service.create', async () => {
    service.create.mockResolvedValue({ id: 2 });
    const dto = { user: 'novo', password: '123' };
    const result = await controller['create'](dto as any);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 2 });
  });

  it('update deve chamar service.update', async () => {
    service.update.mockResolvedValue({ id: 3 });
    const dto = { id: 3, user: 'atualizado', password: '123' };
    const result = await controller['update'](dto as any);
    expect(service.update).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 3 });
  });
});
