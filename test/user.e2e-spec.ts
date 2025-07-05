/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { setupTestApp, closeTestApp, createAndAuthUser } from './test-setup';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('User e2e', () => {
  let appInstance: INestApplication;
  let token: string;
  let userId: string;

  beforeAll(async () => {
    appInstance = await setupTestApp();
    const user = await createAndAuthUser(appInstance);
    token = user.token;
    userId = user.userId;
  });

  afterAll(async () => {
    await closeTestApp(appInstance);
  });

  it('Deve cadastrar um novo usuário', async () => {
    const response = await request(appInstance.getHttpServer())
      .post('/users')
      .send({
        name: 'Novo Usuário',
        user: 'novo@user.com', // email válido
        password: 'senhaForte123', // senha com mais de 8 caracteres
        photo: 'foto.jpg',
      })
      .expect(201);
    expect(response.body).toHaveProperty('id');
  });

  it('Não deve cadastrar um usuário duplicado', async () => {
    await request(appInstance.getHttpServer())
      .post('/users')
      .send({
        name: 'Root',
        user: 'root@root.com',
        password: 'senhaForte',
        photo: 'foto.jpg',
      })
      .expect(400);
  });

  it('Deve autenticar o usuário (login)', async () => {
    const resposta = await request(appInstance.getHttpServer())
      .post('/users/login')
      .send({
        user: 'root@root.com',
        password: 'senhaForte123', // Corrigido para a senha usada na criação
      })
      .expect(200);
    expect(resposta.body).toHaveProperty('token');
  });

  it('Deve listar todos os usuários', async () => {
    return request(appInstance.getHttpServer())
      .get('/users')
      .set('Authorization', `${token}`)
      .send({})
      .expect(200);
  });

  it('Deve listar o usuário pelo id', async () => {
    return request(appInstance.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `${token}`)
      .send({})
      .expect(200);
  });

  it('Deve atualizar um usuário', async () => {
    return request(appInstance.getHttpServer())
      .put('/users')
      .set('Authorization', `${token}`)
      .send({
        id: userId,
        name: 'Root Atualizado',
        user: 'root@root.com',
        password: 'senhaForte123',
        photo: 'foto-atualizada.jpg',
      })
      .expect(200)
      .then((response) => {
        expect(response.body.name).toEqual('Root Atualizado');
      });
  });
});
