import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { DevService } from './dev.service';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { AchievementService } from 'src/achievement/achievement.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { CreateMatchDto } from 'src/match/dto/create-match.dto';
import { MatchService } from 'src/match/match.service';
import { RelationshipService } from 'src/relationship/relationship.service';
import { User } from 'src/entities/user.entity';
import { DebugRoute } from 'src/auth/guard/debugRoute.guard';

interface ApiResponse {
  success: boolean,
  message: string,
  data?: any,
}

@UseGuards(DebugRoute)
@Controller('dev')
export class DevController {
  constructor(
    private readonly devService: DevService,
    private readonly achievementService: AchievementService,
    private readonly matchService: MatchService,
    private readonly relationshipService: RelationshipService,
    ) {}

  /* -----User related dev endpoints----- */
  /**
   * Create a dev profile, token will be issued through cookie
   * @param req `req.user` to reach user data
   * @param res `set-cookie` field included
   * @param dto CreateUserDto
   */
  @Post('register')
  async register(@Req() req: Request, @Res() res: Response, @Body() dto: CreateUserDto) {
    console.log('Creating dev acc');
    const user = await this.devService.createDevAcc(res, dto);
    res.send(user);
  }

/**
 * Login as a specific dev user
 * 
 * Following normal login procedure
 */
  @Get('login/:id')
  async login(@Res() res: Response, @Param('id', ParseIntPipe) id: number) {
    const verify = await this.devService.devLogin(res, id);
    res.send(verify);
  }

  /**
   * Login as a specific dev user,
   * 
   * Bypassing tfa authentication
   */
  @Get('login/:id/bypasstfa')
  async absLogin(@Res() res: Response, @Param('id', ParseIntPipe) id: number) {
    const verify = await this.devService.absDevLogin(res, id);
    res.send(verify);
  }
  
  /**
   * Create 100 dummies, all data random generated
   */
  @Get('dummy')
  async createDummy() {
    await this.devService.createDummyUsers();
  }
  
  /**
   * fetch all User in the database
   * @returns `User[]`
   */
  @Get('users')
  getUsers() {
    return this.devService.getUsers();
  }

  /**
   * Delete a specific user
   * @param id user id to delete
   * @returns deleted `User`
   */
  @Delete('user/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.devService.deleteOne(id);
  }

  /**
   * Remove all user data, reset index counter to 1
   */
  @Delete('users')
  async deleteAll() {
    await this.devService.deleteAllUsers();
  }

  /* -----Auth related dev endpoints----- */
  /**
   * fetch all user 2fa secret
   */
  @Get('boxes')
  async boxes() {
    return await this.devService.getBoxes();
  }

  @Get('box/:id')
  async getBox(@Param('id', ParseIntPipe) id: number) {
    return await this.devService.getBox(id);

  }

  /**
   * Remove a specific user secret and deactivate 2fa
   * @param id user id
   * @returns box deleted
   */
  @Delete('box/:id')
  async burnOne(@Param('id', ParseIntPipe) id: number) {
    return await this.devService.burnOneSecret(id);
  }

  /**
   * Burn all secrets
   * @Warning will brick all tfa user
   */
  @Delete('boxes')
  burn() {
    return this.devService.burnAllSecret();
  }

  /* -----Achievement related dev endpoints ----- */
  /**
   * Grant achievement to a user
   * @param dto `achievement_id` and `user_id`
   * @returns `ApiResponse`
   */
  @Post('achievement')
  GrantAchievement(@Body() dto: CreateAchievementDto): Promise<ApiResponse> {
    return this.achievementService.GrantAchievement(dto);
  }

  /* -----Match related dev endpoints ----- */
  @Post('match')
  createMatch(@Body() dto: CreateMatchDto) {
    return this.matchService.createMatch(dto);
  }

  @Get('match/dummy/:user_id')
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

  /* -----Relationship related dev endpoints----- */
  @Get('relationship/dummy/:id/friend')
  makeFriends(@Param('id', ParseIntPipe) id: number) {
    this.relationshipService.generateDebugRelationships(id, 'friend');
  }

  @Get('relationship/dummy/:id/blocked')
  blockUsers(@Param('id', ParseIntPipe) id: number) {
    this.relationshipService.generateDebugRelationships(id, 'blocked');
  }
}
