import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private _usernameField: string;
  private _passwordField: string;

  constructor(private readonly authService: AuthService) {
    super();
    this._usernameField = 'user';
    this._passwordField = 'password';
  }

  async validate(user: string, password: string): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const userIsValid = await this.authService.validateUser(user, password);
    if (!userIsValid) {
      throw new UnauthorizedException('Usuário e/ou senha incorretos!');
    }
    return userIsValid; // retorno não será usado em lugar nenhum, é apenas para seguir as regras de um retorno quando se usa a tipagem de Promise
  }
}
