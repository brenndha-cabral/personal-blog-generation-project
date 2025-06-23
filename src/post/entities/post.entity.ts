import { IsNotEmpty } from 'class-validator';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
}
