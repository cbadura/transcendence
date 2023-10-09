import { Test, TestingModule } from '@nestjs/testing';
import { MatchUserService } from './match-user.service';

describe('MatchUserService', () => {
  let service: MatchUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchUserService],
    }).compile();

    service = module.get<MatchUserService>(MatchUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
