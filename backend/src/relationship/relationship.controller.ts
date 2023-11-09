import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { RelationshipService } from './relationship.service';
import { CreateRelationshipDto } from './dto/create-relationship.dto';
import { DebugRoute } from 'src/auth/guard/debugRoute.guard';
import { Request } from 'express';
import { jwtAuthGuard } from 'src/auth/guard/jwt.guard';

@Controller('relationship')
export class RelationshipController {
    constructor( private readonly relationshipService: RelationshipService) {}

    @UseGuards(jwtAuthGuard)
    @Delete('/:relationship_id') // extra check for user id from dto
    DeleteRelationship(@Req() req: Request,
        @Param('relationship_id', ParseIntPipe) relationship_id: number) {
        return this.relationshipService.deleteRelationship(req.user['id'], relationship_id);
    }

    // dev
    @UseGuards(DebugRoute)
    @Get('/dummy/:id/friend') // added to dev module
    MakeFriends(@Param('id', ParseIntPipe) id: number) {
        this.relationshipService.generateDebugRelationships(id,'friend');
    }

    // dev
    @UseGuards(DebugRoute)
    @Get('/dummy/:id/blocked') //added to dev module
    BlockRandomUsers(@Param('id', ParseIntPipe) id: number) {
        this.relationshipService.generateDebugRelationships(id,'blocked');
    }

    @UseGuards(jwtAuthGuard)
    @Post() // extra check for user id from dto
    CreateRelationship(@Req() req: Request,
        @Body()createRelationshipDto: CreateRelationshipDto) {
        return this.relationshipService.createOrUpdateRelationship(req.user['id'], createRelationshipDto);
    }


}
