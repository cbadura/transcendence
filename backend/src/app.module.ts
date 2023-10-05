import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import * as path from 'path';

@Global() //might not be the best way, but only way for the multerModule to register globally
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'transcendence',
      password: 'transcendence',
      database: 'transcendence',
      entities: [User],
      synchronize: true,
    }),
    UserModule,
    MulterModule.register({
      dest: './uploads/'
    }),
  ], 
  controllers: [AppController],
  providers: [AppService],
  exports: [MulterModule],
})
export class AppModule {}
