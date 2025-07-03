import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.findUserById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async update(@Body() user: User): Promise<User> {
    return this.userService.update(user);
  }
}
