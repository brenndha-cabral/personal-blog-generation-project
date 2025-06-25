import { IsNotEmpty } from 'class-validator';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Theme } from '../../theme/entities/theme.entity';

@Entity({ name: 'tb_posts' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ length: 100, nullable: false })
  title: string;

  @IsNotEmpty()
  @Column({ length: 100, nullable: false })
  text: string;

  @UpdateDateColumn()
  date: Date;

  @ManyToOne(() => Theme, (theme) => theme.post, {
    onDelete: 'CASCADE',
  })
  theme: Theme;
}
