import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const document = new DocumentBuilder()
    .setTitle('Blog API')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token', // nom du security scheme
    )
    .build();
  const writerDescriptorDocument = SwaggerModule.createDocument(app, document);
  SwaggerModule.setup('api', app, writerDescriptorDocument);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
