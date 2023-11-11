import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ChatModule } from './chat/chat.module';
import { AchievementDefinitionModule } from './achievement-definition/achievement-definition.module';
import { AchievementModule } from './achievement/achievement.module';
import { SeedingModule } from './seeding/seeding.module';
import * as path from 'path';
import { AchievementDefinition } from './entities/achievement-definition.entity';
import { Achievement } from './entities/achievement.entity';
import { MatchModule } from './match/match.module';
import { MatchUserModule } from './match-user/match-user.module';
import { Match } from './entities/match.entity';
import { MatchUser } from './entities/match-user.entity';
import { RelationshipModule } from './relationship/relationship.module';
import { Relationship } from './entities/relationship.entity';
import { NetworkGameModule } from './network-game/network-game.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SecretBox } from './entities/secretBox.entity';
import { DevModule } from './dev/dev.module';

const isDevMode: boolean = process.env.MODE === 'dev';

@Global() //might not be the best way, but only way for the multerModule to register globally
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: Number.parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User,AchievementDefinition,Achievement,Match,MatchUser,Relationship,SecretBox],
      synchronize: true,
    }),
    MulterModule.register({
      dest: './uploads/'
    }),
    UserModule,
    AchievementDefinitionModule,
    AchievementModule,
    SeedingModule,
    ChatModule,
    MatchModule,
    MatchUserModule,
    RelationshipModule,
    NetworkGameModule,
    AuthModule,
    ...isDevMode ? [DevModule] : [],
  ], 
  controllers: [AppController],
  providers: [AppService],
  exports: [MulterModule],
})
export class AppModule {}
