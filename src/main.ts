import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ESLint } from 'eslint';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ALLOW FRONTEND REQUESTS
  app.enableCors({
    origin: 'http://localhost:5173', // Your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  await app.listen(3000);
}
bootstrap();