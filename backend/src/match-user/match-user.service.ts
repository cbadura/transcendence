import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchUser } from 'src/entities/match-user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MatchUserService {
    constructor(@InjectRepository(MatchUser) private matchUserRepository: Repository<MatchUser>)
    {}
}
