import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Theme } from '../entities/theme.entity';
import { ThemeController } from '../controllers/theme.controller';
import { ThemeService } from '../services/theme.service';

@Module({
  imports: [TypeOrmModule.forFeature([Theme])],
  providers: [ThemeService],
  controllers: [ThemeController],
  exports: [ThemeService],
})
export class ThemeModule {}
