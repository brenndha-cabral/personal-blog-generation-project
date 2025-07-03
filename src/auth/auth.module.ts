import { Module } from '@nestjs/common';
import { Bcrypt } from './bcript/bcript';

@Module({
  imports: [],
  providers: [Bcrypt],
  controllers: [],
  exports: [Bcrypt],
})
export class AuthModule {}
