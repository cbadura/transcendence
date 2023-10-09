import { Module } from '@nestjs/common';
import { RelationshipController } from './relationship.controller';
import { RelationshipService } from './relationship.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Relationship } from 'src/entities/relationship.entity';
import { User } from 'src/entities/user.entity';

@Module({
  controllers: [RelationshipController],
  providers: [RelationshipService],
  imports: [TypeOrmModule.forFeature([Relationship,User])]
})
export class RelationshipModule {}
