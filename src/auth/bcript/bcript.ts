import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class Bcrypt {
  async encryptPassword(password: string): Promise<string> {
    const encode: number = 10; // quantas vezes foram criptografadas
    return await bcrypt.hash(password, encode);
  }

  async comparePassword(
    passwordEntered: string,
    dbPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(passwordEntered, dbPassword);
  }
}
