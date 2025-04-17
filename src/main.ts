import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import redocExpressMiddleware from 'redoc-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  const swaggerConfig = new DocumentBuilder()
    .setTitle('VorPlay API')
    .setDescription('Documentação da API do VorPlay')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    ignoreGlobalPrefix: false,
  });

  app.use('/api/v1/swagger.json', (_req, res) => res.json(document));
  SwaggerModule.setup('api/v1/docs', app, document);
  app.use(
    '/api/v1/redoc',
    redocExpressMiddleware({
      title: 'VorPlay API Docs',
      specUrl: '/api/v1/swagger.json',
      redocOptions: {
        theme: { colors: { primary: { main: '#dd2c00' } } },
      },
    }),
  );

  await app.listen(3000);
  console.log(`🚀 Server running on: ${await app.getUrl()}/api/v1`);
}

bootstrap();
