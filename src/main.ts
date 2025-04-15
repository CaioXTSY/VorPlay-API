import 'dotenv/config';                    
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('VorPlay API')
    .setDescription('Documentação da API do VorPlay')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    ignoreGlobalPrefix: false,
  });

  SwaggerModule.setup('api/v1/docs', app, document);

  app.enableCors();

  await app.listen(3000);
  console.log(`🚀 Server running on: ${await app.getUrl()}/api/v1`);
}

bootstrap();
