import { IsNotEmpty } from 'class-validator';
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

@Entity({ name: 'tb_themes' })
export class Theme {
  @PrimaryGeneratedColumn() // ('uuid') -> poderia ser neste padrão tbm
  @ApiProperty()
  id: number;

  @IsNotEmpty()
  @Column({ length: 255, nullable: false })
  @ApiProperty({ example: 'Nome do método de cartomancia' })
  description: string;

  @Column({ nullable: false })
  @ApiProperty({ example: 'Origem histórica (ex: "Europa Medieval")' })
  origin: string;

  @Column()
  @ApiProperty({ example: 'Imagem representativa' })
  photo: string;

  @CreateDateColumn()
  @ApiProperty({ readOnly: true })
  created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ readOnly: true })
  update_at: Date;

  @ApiProperty({ readOnly: true })
  @OneToMany(() => Post, (post) => post.theme)
  post: Post[];
}
