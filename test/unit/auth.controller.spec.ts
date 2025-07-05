/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/controllers/auth.controller';
import { AuthService } from '../../src/auth/services/auth.service';

const mockAuthService = {
  login: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: typeof mockAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();
    controller = module.get<AuthController>(AuthController);
    service = module.get(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('login deve chamar service.login', async () => {
    service.login.mockResolvedValue({ token: 'abc' });
    const dto = { user: 'user', password: '123' };
    const result = await controller['login'](dto as any);
    expect(service.login).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ token: 'abc' });
  });

  it('login deve propagar erro do service', async () => {
    service.login.mockRejectedValue(new Error('erro'));
    await expect(
      controller['login']({ user: 'user', password: '123' } as any),
    ).rejects.toThrow('erro');
  });
});
