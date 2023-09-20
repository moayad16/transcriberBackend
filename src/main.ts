import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {config} from 'dotenv';

async function bootstrap() {
  const env = config();
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    // origin: '*',
    origin: 'https://transcriber-io.onrender.com',
    methods: ['GET', 'POST'],
  });
  await app.listen(8080);
}
bootstrap();
