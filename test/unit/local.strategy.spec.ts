/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { LocalStrategy } from '../../src/auth/strategy/local.strategy';
import { UnauthorizedException } from '@nestjs/common';

describe('LocalStrategy', () => {
  let authService: any;
  let strategy: LocalStrategy;

  beforeEach(() => {
    authService = { validateUser: jest.fn() };
    strategy = new LocalStrategy(authService);
  });

  it('deve retornar user se válido', async () => {
    authService.validateUser.mockResolvedValue({ id: 1, user: 'user' });
    const result = await strategy.validate('user', 'pass');
    expect(result).toEqual({ id: 1, user: 'user' });
  });

  it('deve lançar UnauthorizedException se inválido', async () => {
    authService.validateUser.mockResolvedValue(null);
    await expect(strategy.validate('user', 'pass')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
