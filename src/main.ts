import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import ValidationPipeOptionsConfig from './_utils/config/validation-pipe-options.config';
import SwaggerCustomOptionsConfig from './_utils/config/swagger-custom-options.config';
import { EnvironmentVariables } from './_utils/config/env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.setGlobalPrefix('api/v1').useGlobalPipes(new ValidationPipe(ValidationPipeOptionsConfig)).enableCors();

  const config = new DocumentBuilder()
    .setTitle('Blog tuto API')
    .setDescription('Routes description of the Blog API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, document, SwaggerCustomOptionsConfig);

  const configService = app.get(ConfigService<EnvironmentVariables, true>);
  return app.listen(configService.get('PORT'));
}
bootstrap();
