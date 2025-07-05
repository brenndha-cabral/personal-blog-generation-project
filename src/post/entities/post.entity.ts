import { IsNotEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Theme } from '../../theme/entities/theme.entity';
import { User } from '../../user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'tb_posts' })
export class Post {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @IsNotEmpty()
  @Column({ length: 100, nullable: false })
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @Column({ nullable: false })
  @ApiProperty()
  text: string;

  @Column()
  @ApiProperty({
    example: 'Ex: "Leitura de 3 cartas", "Mapa Astral"',
  })
  readingType: string;

  @Column('simple-array', { nullable: true })
  @ApiProperty({
    example: 'Cartas envolvidas ex: ["O Louco", "A Sacerdotisa"]',
  })
  cards?: string[];

  @CreateDateColumn()
  @ApiProperty({ readOnly: true })
  created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ readOnly: true })
  update_at: Date;

  @ApiProperty({ type: () => Theme })
  @ManyToOne(() => Theme, (theme) => theme.post, {
    onDelete: 'CASCADE',
  })
  theme: Theme;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.post, {
    onDelete: 'CASCADE',
  })
  user: User;
}
