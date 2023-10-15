import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from 'src/entities/match.entity';
import { Repository } from 'typeorm';
import { CreateMatchDto } from './dto/create-match.dto';
import { User } from 'src/entities/user.entity';
import { MatchUser } from 'src/entities/match-user.entity';
import {Decimal} from 'decimal.js';

@Injectable()
export class MatchService {
    constructor(
        @InjectRepository(Match) private matchRepository: Repository<Match>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(MatchUser) private matchUserRepository: Repository<MatchUser>,
    ) {}

    getMatches(): Promise<Match[]>{
        return this.matchRepository.find({relations: ["matchUsers","matchUsers.user"]});
    }

    getMatch(id: number): Promise<Match>{
        return this.matchRepository.findOne({where: {id: id},relations: ["matchUsers","matchUsers.user"],});
    }



    //figures out who won the game and sets the outcome property of each element //currently works with 2 users, if we want to have more we need to loop through the users
    determineMatchOutcome(createMatchDto: CreateMatchDto): void {
        if(createMatchDto.matchEndReason.reason == 'disconnect'){
            if( createMatchDto.matchUsers[0].user_id == createMatchDto.matchEndReason.disconnected_user_id){
                createMatchDto.matchUsers[0].outcome = false;
                createMatchDto.matchUsers[1].outcome = true;
            }
            else{
                createMatchDto.matchUsers[0].outcome = true;
                createMatchDto.matchUsers[1].outcome = false;
            }
        }
        else if(createMatchDto.matchUsers[0].score > createMatchDto.matchUsers[1].score){
            createMatchDto.matchUsers[0].outcome = true;
            createMatchDto.matchUsers[1].outcome = false;
        }
        else{
            createMatchDto.matchUsers[0].outcome = false;
            createMatchDto.matchUsers[1].outcome = true;
        }
    }

    //this data should eventually live in an XP table if we ever have more things that can give user experience
    determineXPGain(outcome: boolean): Decimal {
        if(outcome == false)
            return new Decimal(0.1);
        else
            return new Decimal(0.5);
    }

    async createMatch(createMatchDto: CreateMatchDto): Promise<Match>{

        // console.log(createMatchDto);
        createMatchDto.matchUsers[0].user = await this.userRepository.findOne({where: {id: createMatchDto.matchUsers[0].user_id}});
        if(createMatchDto.matchUsers[0].user == null )
        throw new NotFoundException(`Did not find User with User ID ${createMatchDto.matchUsers[0].user_id}`);
        createMatchDto.matchUsers[1].user = await this.userRepository.findOne({where: {id: createMatchDto.matchUsers[1].user_id}});
        if(createMatchDto.matchUsers[1].user == null)
            throw new NotFoundException(`Did not find User with User ID ${createMatchDto.matchUsers[1].user_id}`);
        
        const match =  new Match();
        match.timestamp = new Date();
        match.reason = createMatchDto.matchEndReason.reason;
        const matchObject = await this.matchRepository.save(match);
        this.determineMatchOutcome(createMatchDto);
        
        for(const participant of createMatchDto.matchUsers){
                const matchUser = new MatchUser();
                matchUser.match = match; 
                matchUser.user = participant.user;
                matchUser.score = participant.score;
                matchUser.outcome = participant.outcome;

                await this.matchUserRepository.save(matchUser);

                //update User stats
                await this.userRepository.update({id: participant.user_id } , {
                    matches: participant.user.matches +1,
                    wins: participant.outcome ? participant.user.wins + 1 : participant.user.wins, //increment only if user won
                    level: new Decimal(participant.user.level).plus(this.determineXPGain(participant.outcome)).toString(), //kill me -.-
                })
        }

        console.log(matchObject.id);
        return await this.matchRepository.findOne(
            { where: { id:matchObject.id },
            relations: ['matchUsers','matchUsers.user'],
         });
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
