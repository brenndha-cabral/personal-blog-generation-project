import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../post/entities/post.entity';

@Entity({ name: 'tb_users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ length: 255, nullable: false })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @Column({ length: 255, nullable: false })
  user: string;

  @MinLength(8)
  @IsNotEmpty()
  @Column({ length: 255, nullable: false })
  password: string;

  @Column({ length: 5000 })
  photo: string;

  @OneToMany(() => Post, (post) => post.user)
  post: Post[];
}
