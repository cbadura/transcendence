import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, //strips away additional data that is not marked with a decorator
    transform: true, //automatically transform payloads to be objects typed according to their DTO classes
  }));
  app.enableCors({
    origin: `https://${process.env.HOST_NAME}:4200`,
    credentials: true // cookie
  });
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
