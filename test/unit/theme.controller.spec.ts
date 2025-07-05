import { Test, TestingModule } from '@nestjs/testing';
import { ThemeController } from '../../src/theme/controllers/theme.controller';
import { ThemeService } from '../../src/theme/services/theme.service';

const mockThemeService = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByAllThemes: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('ThemeController', () => {
  let controller: ThemeController;
  let service: typeof mockThemeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThemeController],
      providers: [{ provide: ThemeService, useValue: mockThemeService }],
    }).compile();
    controller = module.get<ThemeController>(ThemeController);
    service = module.get(ThemeService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll deve chamar service.findAll', async () => {
    service.findAll.mockResolvedValue(['theme1']);
    const result = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual(['theme1']);
  });

  it('findById deve chamar service.findById', async () => {
    service.findById.mockResolvedValue({ id: 1 });
    const result = await controller.findById(1);
    expect(service.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual({ id: 1 });
  });

  it('findById deve propagar erro do service', async () => {
    service.findById.mockRejectedValue(new Error('erro'));
    await expect(controller.findById(1)).rejects.toThrow('erro');
  });

  it('findByAllThemes deve chamar service.findByAllThemes', async () => {
    service.findByAllThemes.mockResolvedValue(['theme2']);
    const result = await controller['findByAllThemes']('abc');
    expect(service.findByAllThemes).toHaveBeenCalledWith('abc');
    expect(result).toEqual(['theme2']);
  });

  it('create deve chamar service.create', async () => {
    service.create.mockResolvedValue({ id: 2 });
    const dto = { description: 'Novo' };
    const result = await controller['create'](dto as any);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 2 });
  });

  it('update deve chamar service.update', async () => {
    service.update.mockResolvedValue({ id: 3 });
    const dto = { id: 3, description: 'Atualizado' };
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
