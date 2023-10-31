import { Body, Controller, Get, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';

@Controller('match')
export class MatchController {
    constructor(private readonly matchService: MatchService) {}


    @Post()
    createMatch(@Body() createMatchDto: CreateMatchDto){
        return this.matchService.createMatch(createMatchDto);
    }

    @Get()
    async getMatches(){
        return await this.matchService.getMatches();
    }

    @Get(":id")
    async getMatch(@Param("id",ParseIntPipe) id: number)  {
        console.log('here')
        return await this.matchService.getMatch(id);
    } 

    @Get('/dummy/:user_id')
    async createDummyMatches(@Param('user_id',ParseIntPipe) id: number ){
        console.log(id);
        //'default' | 'special'
        for (let i = 0; i < 10; i++) {
            let score = Math.floor(Math.random() * 1000);
            let oppID = await this.matchService.getRandomUserID(id);
            let oppScore = Math.floor(Math.random() * 1000);
            let matchtype = Math.floor(Math.random() * 1000) % 2 == 0 ? 'default' : 'special';
            if(score == oppScore)
                score++;
            let matchDTo= {
                matchType: matchtype,
                matchEndReason: {
                    reason: 'score',
                },
                "matchUsers":[
                    {"user_id": id,"score": score},
                    {"user_id": oppID,"score": oppScore}
                ]
              } as CreateMatchDto;
            await this.matchService.createMatch(matchDTo);
        }
        return null;
    }

}
