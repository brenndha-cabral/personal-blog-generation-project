/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Test, TestingModule } from '@nestjs/testing';
// import { AuthService } from '/auth/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../src/user/services/user.service';
import { Bcrypt } from '../../src/auth/bcript/bcript';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../src/auth/services/auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let userService: any;
  let jwtService: any;
  let bcrypt: any;

  beforeEach(async () => {
    userService = { findByUser: jest.fn() };
    jwtService = { sign: jest.fn() };
    bcrypt = { comparePassword: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
        { provide: Bcrypt, useValue: bcrypt },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('validateUser deve lançar UnauthorizedException se usuário não existe', async () => {
    userService.findByUser.mockResolvedValue(null);
    await expect(service.validateUser('user', 'pass')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('validateUser deve retornar response se senha bate', async () => {
    userService.findByUser.mockResolvedValue({
      id: 1,
      password: 'hash',
      name: 'User',
    });
    bcrypt.comparePassword.mockResolvedValue(true);
    const result = await service.validateUser('user', 'pass');
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('name');
  });

  it('validateUser deve retornar null se senha não bate', async () => {
    userService.findByUser.mockResolvedValue({
      id: 1,
      password: 'hash',
      name: 'User',
    });
    bcrypt.comparePassword.mockResolvedValue(false);
    const result = await service.validateUser('user', 'pass');
    expect(result).toBeNull();
  });

  it('login deve retornar token e dados do usuário', async () => {
    userService.findByUser.mockResolvedValue({
      id: 1,
      name: 'User',
      photo: 'foto.jpg',
    });
    jwtService.sign.mockReturnValue('token123');
    const result = await service.login({ user: 'user' } as any);
    expect(result).toHaveProperty('token');
    expect(result.token).toContain('Bearer');
    expect(result).toHaveProperty('id', 1);
    expect(result).toHaveProperty('name', 'User');
    expect(result).toHaveProperty('photo', 'foto.jpg');
  });
});
