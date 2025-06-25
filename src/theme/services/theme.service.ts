import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { Theme } from '../entities/theme.entity';

@Injectable()
export class ThemeService {
  constructor(
    @InjectRepository(Theme)
    private themeRepository: Repository<Theme>,
  ) {}

  async findAll(): Promise<Theme[]> {
    return await this.themeRepository.find({
      relations: { post: true },
    });
  }

  async findById(id: number): Promise<Theme> {
    const themeById = await this.themeRepository.findOne({
      where: { id },
      relations: { post: true },
    });

    if (!themeById) {
      throw new HttpException('Tema não encontrado', HttpStatus.NOT_FOUND);
    }

    return themeById;
  }

  async findByAllThemes(description: string): Promise<Theme[]> {
    const themesByDescription = await this.themeRepository.find({
      where: { description: ILike(`%${description}%`) },
    });

    if (!themesByDescription) {
      throw new HttpException('Temas não encontrados', HttpStatus.NOT_FOUND);
    }

    return themesByDescription;
  }

  async create(theme: Theme): Promise<Theme> {
    return await this.themeRepository.save(theme);
  }

  async update(theme: Theme): Promise<Theme> {
    await this.findById(theme.id);
    return await this.themeRepository.save(theme);
  }

  async delete(id: number): Promise<DeleteResult> {
    await this.findById(id);
    return await this.themeRepository.delete(id);
  }
}
