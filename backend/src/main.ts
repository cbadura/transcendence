import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport'
import { DataSource } from 'typeorm';
import { ESession } from './entities/session.entity';
import { TypeormStore } from 'connect-typeorm';
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const sessionRepo = app.get(DataSource).getRepository(ESession);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, //strips away additional data that is not marked with a decorator
    transform: true, //automatically transform payloads to be objects typed according to their DTO classes
  }));
  app.enableCors({
    origin: 'http://localhost:4200'
  });
  app.use(session({
    cookie: {
      maxAge: 60000 * 60 * 24,
    },
    secret: 'slkjfskjffsdf',
    resave: false,
    saveUninitialized: false,
    store: new TypeormStore({
      cleanupLimit: 10,
    }).connect(sessionRepo),
  })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3000);
}
bootstrap();
