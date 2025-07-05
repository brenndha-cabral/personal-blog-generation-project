/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  setupTestApp,
  closeTestApp,
  createAndAuthUser,
  createTheme,
} from './test-setup';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('Theme e2e', () => {
  let appInstance: INestApplication;
  let token: string;
  let themeId: string;

  beforeAll(async () => {
    appInstance = await setupTestApp();
    const user = await createAndAuthUser(appInstance);
    token = user.token;
    const theme = await createTheme(appInstance, token);
    themeId = theme.themeId;
  });

  afterAll(async () => {
    await closeTestApp(appInstance);
  });

  it('Deve cadastrar um novo tema', async () => {
    const response = await request(appInstance.getHttpServer())
      .post('/themes')
      .set('Authorization', `${token}`)
      .send({
        description: 'Outro tema de teste',
        origin: 'Antiga Grécia',
        photo: 'imagem2.jpg',
      })
      .expect(201);
    expect(response.body).toHaveProperty('id');
  });

  it('Deve listar todos os temas', async () => {
    return request(appInstance.getHttpServer())
      .get('/themes')
      .set('Authorization', `${token}`)
      .expect(200);
  });

  it('Deve listar o tema pelo id', async () => {
    return request(appInstance.getHttpServer())
      .get(`/themes/${themeId}`)
      .set('Authorization', `${token}`)
      .expect(200);
  });

  it('Deve atualizar um tema', async () => {
    return request(appInstance.getHttpServer())
      .put('/themes')
      .set('Authorization', `${token}`)
      .send({
        id: themeId,
        description: 'Tema atualizado',
        origin: 'Atualizado',
        photo: 'nova-imagem.jpg',
      })
      .expect(200)
      .then((response) => {
        expect(response.body.description).toEqual('Tema atualizado');
        expect(response.body.origin).toEqual('Atualizado');
        expect(response.body.photo).toEqual('nova-imagem.jpg');
      });
  });
});
