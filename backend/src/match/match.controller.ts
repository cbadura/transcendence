import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { DebugRoute } from 'src/auth/guard/debugRoute.guard';
import { jwtAuthGuard } from 'src/auth/guard/jwt.guard';

@Controller('match')
export class MatchController {
    constructor(private readonly matchService: MatchService) {}

    @UseGuards(jwtAuthGuard)
    @Get()
    async getMatches(){
        return await this.matchService.getMatches();
    }

    @UseGuards(jwtAuthGuard)
    @Get(":id")
    async getMatch(@Param("id",ParseIntPipe) id: number)  {
        console.log('here')
        return await this.matchService.getMatch(id);
    }

}
