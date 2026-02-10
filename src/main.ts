import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ESLint } from 'eslint';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ALLOW FRONTEND REQUESTS
  app.enableCors({
    origin: true, // Allow all origins in dev, or specify the IPs
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3000, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();