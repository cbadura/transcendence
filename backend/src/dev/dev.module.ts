import { Module } from '@nestjs/common';
import { DevController } from './dev.controller';
import { DevService } from './dev.service';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Achievement } from 'src/entities/achievement.entity';
import { SecretBox } from 'src/entities/secretBox.entity';
import { AchievementModule } from 'src/achievement/achievement.module';
import { MatchModule } from 'src/match/match.module';
import { RelationshipModule } from 'src/relationship/relationship.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User, SecretBox, Achievement]),
    UserModule,
    AuthModule,
    AchievementModule,
    MatchModule,
    RelationshipModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d'}
    }),
  ],
  controllers: [DevController],
  providers: [DevService]
})
export class DevModule {}
