import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { AchievementDefinitionModule } from './achievement-definition/achievement-definition.module';
import { AchievementModule } from './achievement/achievement.module';
import { SeedingModule } from './seeding/seeding.module';
import * as path from 'path';
import { AchievementDefinition } from './entities/achievement-definition.entity';

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
      entities: [User,AchievementDefinition],
      synchronize: true,
    }),
    MulterModule.register({
      dest: './uploads/'
    }),
    UserModule,
    AchievementDefinitionModule,
    AchievementModule,
    SeedingModule,
  ], 
  controllers: [AppController],
  providers: [AppService],
  exports: [MulterModule],
})
export class AppModule {}
