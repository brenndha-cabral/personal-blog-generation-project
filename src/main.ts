import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get<number>('PORT', 4000);

  process.env.TZ = config.get<string>('TIMEZONE');

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  await app.listen(port);
}

bootstrap();
