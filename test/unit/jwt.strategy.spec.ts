/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { JwtStrategy } from '../../src/auth/strategy/jwt.strategy';

describe('JwtStrategy', () => {
  it('deve retornar o payload recebido no validate', async () => {
    const strategy = new JwtStrategy();
    const payload = { sub: 1, name: 'User' };
    const result = await strategy.validate(payload);
    expect(result).toBe(payload);
  });
});
