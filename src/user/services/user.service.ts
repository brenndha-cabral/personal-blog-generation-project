import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bcrypt } from '../../auth/bcript/bcript';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private bcrypt: Bcrypt,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findByUser(user: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { user: user },
      relations: { post: true },
    });
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { post: true },
    });

    if (!user)
      throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);

    return user;
  }

  async create(user: User): Promise<User> {
    const findUser = await this.findByUser(user.user);

    if (findUser)
      throw new HttpException('O Usuário já existe!', HttpStatus.BAD_REQUEST);

    user.password = await this.bcrypt.encryptPassword(user.password);
    return await this.userRepository.save(user);
  }

  async update(user: User): Promise<User> {
    await this.findUserById(user.id);

    const findUser = await this.findByUser(user.user);

    if (findUser && findUser.id !== user.id)
      throw new HttpException(
        'Usuário (e-mail) já cadastrado!',
        HttpStatus.BAD_REQUEST,
      );

    user.password = await this.bcrypt.encryptPassword(user.password);
    return await this.userRepository.save(user);
  }
}
