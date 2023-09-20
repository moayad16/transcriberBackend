import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set up CORS options
  const corsOptions = {
    origin: 'https://transcriber-io.onrender.com',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  };

  app.enableCors(corsOptions);

  await app.listen(process.env.PORT || 8080);
}
bootstrap();
