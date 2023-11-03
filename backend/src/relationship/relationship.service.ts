import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Relationship } from 'src/entities/relationship.entity';
import { Repository } from 'typeorm';
import { CreateRelationshipDto } from './dto/create-relationship.dto';
import { User } from 'src/entities/user.entity';


@Injectable()
export class RelationshipService {
    constructor(
        @InjectRepository(Relationship) private relationshipRepository: Repository<Relationship>,
        @InjectRepository(User) private userRepository: Repository<User>
         ) {}


        private async getUser(userId: number): Promise<User> {
            let user = await this.userRepository.findOne({where: {id: userId}});
            if(user == null)
                throw new NotFoundException(`Did not find User with User ID ${userId}`);
            return user;
        }

        async createOrUpdateRelationship(dto: CreateRelationshipDto): Promise<Relationship> {

            //check if both IDs are valid REFACTOR THIS CODE TO HAVE A GENERIC MODULE THAT HANDLES VALIDATION OF EXISTING RECORDS
            const user = await this.getUser(dto.user_id);
            const otherUser = await this.getUser(dto.relationship_user_id);
            if(user.id == otherUser.id)
                throw new NotFoundException(`You can't create a relationship with yourself! Go get a room...`);

            const existingRecord = await this.relationshipRepository.findOne({where: {primary_user_id: dto.user_id, relational_user_id: dto.relationship_user_id}});
            if(existingRecord){
                existingRecord.relationship_status = dto.relationship_status
                console.log('found existing record. Updating existing record')
                return this.relationshipRepository.save(existingRecord)
                }

            const relationship = new Relationship();
            relationship.primary_user_id = dto.user_id;
            relationship.relational_user_id = dto.relationship_user_id;
            relationship.relationship_status = dto.relationship_status;
            return this.relationshipRepository.save(relationship);
        }


        async deleteRelationship(relationship_id: number) {
            const removedRelationships = await this.relationshipRepository.delete(relationship_id);
            if (removedRelationships.affected === 0) {
                throw new NotFoundException(`Relationship with ID ${relationship_id} not found.`);
              }
            return {message: `Successfully deleted relationship with ID ${relationship_id}.`, success: true};
        }


        async generateDebugRelationships(id: number,relationship_status: 'friend' | 'blocked'){
            for (let i = 0; i < 10; i++) {
                let userID = await this.getRandomUserID(id);
                
                let dto = new CreateRelationshipDto();
                dto.user_id = id;
                dto.relationship_user_id = userID;
                dto.relationship_status = relationship_status;

                await this.createOrUpdateRelationship(dto);
            }
        }

        async getRandomUserID(excludedUserId: number): Promise<number> {
            const randomValue = await this.userRepository
            .createQueryBuilder()
            .select()
            .where('id != :excludedUserId', { excludedUserId })
            .orderBy('RANDOM()') // Order by random to get a random result
            .getOne();
            // console.log(randomValue);
          return randomValue.id ;
        }
}
