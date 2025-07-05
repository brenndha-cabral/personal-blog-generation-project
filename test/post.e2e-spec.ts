/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  setupTestApp,
  closeTestApp,
  createAndAuthUser,
  createTheme,
} from './test-setup';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('Post e2e', () => {
  let appInstance: INestApplication;
  let token: string;
  let userId: string;
  let themeId: string;

  beforeAll(async () => {
    appInstance = await setupTestApp();
    const user = await createAndAuthUser(appInstance);
    token = user.token;
    userId = user.userId;
    const theme = await createTheme(appInstance, token);
    themeId = theme.themeId;
  });

  afterAll(async () => {
    await closeTestApp(appInstance);
  });

  it('Deve cadastrar uma nova postagem', async () => {
    const response = await request(appInstance.getHttpServer())
      .post('/posts')
      .set('Authorization', `${token}`)
      .send({
        title: 'Lorem Ipsum',
        text: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
        readingType: 'Leitura de 3 cartas',
        cards: ['O Louco', 'A Sacerdotisa'],
        theme: themeId,
        user: userId,
      })
      .expect(201);
    expect(response.body).toHaveProperty('id');
  });
});
