/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

export const setupTestApp = async (): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        entities: [__dirname + '/../src/**/entities/*.entity.ts'],
        synchronize: true,
        dropSchema: true,
      }),
      AppModule,
    ],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  await app.init();
  return app;
};

export const closeTestApp = async (app: INestApplication) => {
  if (app) await app.close();
};

export const createAndAuthUser = async (
  app: INestApplication,
): Promise<{ token: string; userId: string }> => {
  const userRes = await request(app.getHttpServer()).post('/users').send({
    name: 'Root',
    user: 'root@root.com',
    password: 'senhaForte123',
    photo: 'foto.jpg',
  });
  const userId = userRes.body.id;

  const loginRes = await request(app.getHttpServer())
    .post('/users/login')
    .send({
      user: 'root@root.com',
      password: 'senhaForte123',
    });
  const token = loginRes.body.token;
  return { token, userId };
};

export const createTheme = async (
  app: INestApplication,
  token: string,
): Promise<{ themeId: string }> => {
  const themeRes = await request(app.getHttpServer())
    .post('/themes')
    .set('Authorization', `${token}`)
    .send({
      description: 'Tema de teste',
      origin: 'Europa Medieval',
      photo: 'imagem.jpg',
    });
  const themeId = themeRes.body.id;
  return { themeId };
};
