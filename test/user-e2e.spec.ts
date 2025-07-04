/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { App } from 'supertest/types';

describe('Testes dos módulos User e Auth (e2e)', () => {
  let app: INestApplication<App>;
  let token: any;
  let userId: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [__dirname + './../src/**/entities/*.entity.ts'],
          synchronize: true,
          dropSchema: true, // apenas em arquivos de teste
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('01 - Deve cadastrar um novo usuário', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Root',
        user: 'root@root.com',
        password: 'senhaForte',
        photo: '--',
      })
      .expect(201);

    userId = response.body.id;
  });

  it('02 - Não deve cadastrar um usuário duplicado', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Root',
        user: 'root@root.com',
        password: 'senhaForte',
        photo: '--',
      })
      .expect(400);
  });

  it('03 - Deve autenticar o usuário (login)', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/users/login')
      .send({
        user: 'root@root.com',
        password: 'senhaForte',
      })
      .expect(200);

    token = resposta.body.token;
  });

  it('04 - Deve listar todos os usuários', async () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `${token}`)
      .send({})
      .expect(200);
  });

  it('05 - Deve listar o usuário pelo id', async () => {
    return request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `${token}`)
      .send({})
      .expect(200);
  });

  it('06 - Deve atualizar um usuário', async () => {
    return request(app.getHttpServer())
      .put(`/users/${userId}`)
      .set('Authorization', `${token}`)
      .send({
        name: 'Root Atualizado',
        user: 'root@root.com',
        password: 'senhaForte',
        photo: '-',
      })
      .expect(200)
      .then((response) => {
        expect(response.body.name).toEqual(response.body.name);
      });
  });
});
