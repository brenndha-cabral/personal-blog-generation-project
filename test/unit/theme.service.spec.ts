/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { ThemeService } from '../../src/theme/services/theme.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Theme } from '../../src/theme/entities/theme.entity';
import { HttpException } from '@nestjs/common';

describe('ThemeService', () => {
  let service: ThemeService;
  let themeRepository: any;

  beforeEach(async () => {
    themeRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThemeService,
        { provide: getRepositoryToken(Theme), useValue: themeRepository },
      ],
    }).compile();
    service = module.get<ThemeService>(ThemeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll deve retornar todos os temas', async () => {
    themeRepository.find.mockResolvedValue([{ id: 1, description: 'T1' }]);
    const result = await service.findAll();
    expect(result).toEqual([{ id: 1, description: 'T1' }]);
  });

  it('findById deve lançar exceção se não encontrar', async () => {
    themeRepository.findOne.mockResolvedValue(null);
    await expect(service.findById(1)).rejects.toBeInstanceOf(HttpException);
  });

  it('findById deve retornar tema se encontrar', async () => {
    themeRepository.findOne.mockResolvedValue({ id: 1, description: 'T1' });
    const result = await service.findById(1);
    expect(result).toEqual({ id: 1, description: 'T1' });
  });

  it('findByAllThemes deve retornar temas pela descrição', async () => {
    themeRepository.find.mockResolvedValue([{ id: 1, description: 'T1' }]);
    const result = await service.findByAllThemes('T1');
    expect(result).toEqual([{ id: 1, description: 'T1' }]);
  });

  it('findByAllThemes deve lançar exceção se não encontrar', async () => {
    themeRepository.find.mockResolvedValue(null);
    await expect(service.findByAllThemes('Nada')).rejects.toBeInstanceOf(
      HttpException,
    );
  });

  it('create deve criar um tema', async () => {
    themeRepository.save.mockResolvedValue({ id: 1, description: 'Novo' });
    const result = await service.create({ description: 'Novo' } as any);
    expect(result).toEqual({ id: 1, description: 'Novo' });
  });

  it('update deve atualizar um tema', async () => {
    service.findById = jest.fn().mockResolvedValue({ id: 1 });
    themeRepository.save.mockResolvedValue({
      id: 1,
      description: 'Atualizado',
    });
    const result = await service.update({
      id: 1,
      description: 'Atualizado',
    } as any);
    expect(result).toEqual({ id: 1, description: 'Atualizado' });
  });

  it('delete deve remover um tema', async () => {
    service.findById = jest.fn().mockResolvedValue({ id: 1 });
    themeRepository.delete.mockResolvedValue({ affected: 1 });
    const result = await service.delete(1);
    expect(result).toEqual({ affected: 1 });
  });

  it('delete deve lançar exceção se tema não existir', async () => {
    service.findById = jest.fn().mockImplementation(() => {
      throw new HttpException('Tema não encontrado', 404);
    });
    await expect(service.delete(99)).rejects.toBeInstanceOf(HttpException);
  });
});
