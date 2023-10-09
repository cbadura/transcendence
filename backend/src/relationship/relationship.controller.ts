import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { RelationshipService } from './relationship.service';
import { CreateRelationshipDto } from './dto/create-relationship.dto';

@Controller('relationship')
export class RelationshipController {
    constructor( private readonly relationshipService: RelationshipService) {}

    @Delete('/:relationship_id')
    DeleteRelationship(@Param('relationship_id', ParseIntPipe) relationship_id: number) {
        return this.relationshipService.deleteRelationship(relationship_id);
    }

    @Get('/dummy/:id/friend')
    MakeFriends(@Param('id', ParseIntPipe) id: number) {
        this.relationshipService.generateDebugRelationships(id,'friend');
    }
    @Get('/dummy/:id/blocked')
    BlockRandomUsers(@Param('id', ParseIntPipe) id: number) {
        this.relationshipService.generateDebugRelationships(id,'blocked');
    }

    @Post()
    CreateRelationship(@Body()createRelationshipDto: CreateRelationshipDto) {
        return this.relationshipService.createOrUpdateRelationship(createRelationshipDto);
    }


}
