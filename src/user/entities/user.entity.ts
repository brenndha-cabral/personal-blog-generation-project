import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from '../../post/entities/post.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'tb_users' })
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @IsNotEmpty()
  @Column({ length: 255, nullable: false })
  @ApiProperty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'email@email.com.br' })
  @Column({ length: 255, nullable: false })
  user: string;

  @MinLength(8)
  @IsNotEmpty()
  @ApiProperty()
  @Column({ nullable: false })
  password: string;

  @Column()
  @ApiProperty()
  photo: string;

  @CreateDateColumn()
  @ApiProperty({ readOnly: true })
  created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ readOnly: true })
  update_at: Date;

  @ApiProperty({ readOnly: true })
  @OneToMany(() => Post, (post) => post.user)
  post: Post[];
}
