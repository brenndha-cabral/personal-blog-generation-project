import { Bcrypt } from '../../src/auth/bcript/bcript';
import * as bcrypt from 'bcrypt';

describe('Bcrypt', () => {
  let service: Bcrypt;

  beforeEach(() => {
    service = new Bcrypt();
    jest.clearAllMocks();
  });

  it('encryptPassword deve chamar bcrypt.hash e retornar o hash', async () => {
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hash123' as never);
    const result = await service.encryptPassword('senha');
    expect(bcrypt.hash).toHaveBeenCalledWith('senha', 10);
    expect(result).toBe('hash123');
  });

  it('comparePassword deve chamar bcrypt.compare e retornar true', async () => {
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
    const result = await service.comparePassword('senha', 'hash123');
    expect(bcrypt.compare).toHaveBeenCalledWith('senha', 'hash123');
    expect(result).toBe(true);
  });

  it('comparePassword deve chamar bcrypt.compare e retornar false', async () => {
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
    const result = await service.comparePassword('senha', 'hash123');
    expect(result).toBe(false);
  });
});
