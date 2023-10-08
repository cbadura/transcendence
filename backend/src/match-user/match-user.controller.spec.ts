import { Test, TestingModule } from '@nestjs/testing';
import { MatchUserController } from './match-user.controller';

describe('MatchUserController', () => {
  let controller: MatchUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchUserController],
    }).compile();

    controller = module.get<MatchUserController>(MatchUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
