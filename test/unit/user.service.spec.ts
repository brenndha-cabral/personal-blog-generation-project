/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../src/user/services/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../src/user/entities/user.entity';
import { Bcrypt } from '../../src/auth/bcript/bcript';
import { HttpException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let userRepository: any;
  let bcrypt: any;

  beforeEach(async () => {
    userRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    bcrypt = {
      encryptPassword: jest.fn(),
      comparePassword: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: userRepository },
        { provide: Bcrypt, useValue: bcrypt },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll deve retornar todos os usuários', async () => {
    userRepository.find.mockResolvedValue([{ id: 1, name: 'User' }]);
    const result = await service.findAll();
    expect(result).toEqual([{ id: 1, name: 'User' }]);
  });

  it('findByUser deve retornar um usuário', async () => {
    userRepository.findOne.mockResolvedValue({ id: 1, user: 'mail@mail.com' });
    const result = await service.findByUser('mail@mail.com');
    expect(result).toEqual({ id: 1, user: 'mail@mail.com' });
  });

  it('findUserById deve lançar exceção se não encontrar', async () => {
    userRepository.findOne.mockResolvedValue(null);
    await expect(service.findUserById(1)).rejects.toBeInstanceOf(HttpException);
  });

  it('create deve lançar exceção se usuário já existe', async () => {
    service.findByUser = jest.fn().mockResolvedValue({ id: 1 });
    await expect(
      service.create({ user: 'mail@mail.com' } as any),
    ).rejects.toBeInstanceOf(HttpException);
  });

  it('create deve criar usuário se não existe', async () => {
    service.findByUser = jest.fn().mockResolvedValue(null);
    bcrypt.encryptPassword.mockResolvedValue('hash');
    userRepository.save.mockResolvedValue({ id: 1, user: 'mail@mail.com' });
    const result = await service.create({
      user: 'mail@mail.com',
      password: '123',
    } as any);
    expect(result).toEqual({ id: 1, user: 'mail@mail.com' });
  });

  it('update deve lançar exceção se e-mail já cadastrado', async () => {
    service.findUserById = jest.fn().mockResolvedValue({ id: 2 });
    service.findByUser = jest.fn().mockResolvedValue({ id: 3 });
    await expect(
      service.update({ id: 2, user: 'mail@mail.com' } as any),
    ).rejects.toBeInstanceOf(HttpException);
  });

  it('update deve atualizar usuário se válido', async () => {
    service.findUserById = jest.fn().mockResolvedValue({ id: 2 });
    service.findByUser = jest.fn().mockResolvedValue({ id: 2 });
    bcrypt.encryptPassword.mockResolvedValue('hash');
    userRepository.save.mockResolvedValue({ id: 2, user: 'mail@mail.com' });
    const result = await service.update({
      id: 2,
      user: 'mail@mail.com',
      password: '123',
    } as any);
    expect(result).toEqual({ id: 2, user: 'mail@mail.com' });
  });

  it('update deve atualizar usuário se não houver conflito de e-mail', async () => {
    service.findUserById = jest.fn().mockResolvedValue({ id: 2 });
    service.findByUser = jest.fn().mockResolvedValue({ id: 2 });
    bcrypt.encryptPassword.mockResolvedValue('hash');
    userRepository.save.mockResolvedValue({ id: 2, user: 'mail@mail.com' });
    const result = await service.update({
      id: 2,
      user: 'mail@mail.com',
      password: '123',
    } as any);
    expect(result).toEqual({ id: 2, user: 'mail@mail.com' });
  });

  it('update deve lançar exceção se usuário não encontrado', async () => {
    service.findUserById = jest.fn().mockImplementation(() => {
      throw new HttpException('Usuário não encontrado!', 404);
    });
    await expect(
      service.update({ id: 99, user: 'x', password: 'y' } as any),
    ).rejects.toBeInstanceOf(HttpException);
  });
});
