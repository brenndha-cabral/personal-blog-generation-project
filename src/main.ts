import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get<number>('PORT', 3000);
  process.env.TZ = config.get<string>('TIMEZONE');

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const configSwagger = new DocumentBuilder()
    .setTitle('Blog Pessoal')
    .setDescription('Projeto Blog Pessoal')
    .setContact(
      'Brenndha Cabral',
      'GitHub: https://github.com/brenndha-cabral',
      'LinkedIn: https://www.linkedin.com/in/brenndhacabral/',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('/swagger', app, document);

  await app.listen(port);
}

bootstrap();
