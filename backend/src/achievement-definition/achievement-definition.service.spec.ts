import { Test, TestingModule } from '@nestjs/testing';
import { AchievementDefinitionService } from './achievement-definition.service';

describe('AchievementDefinitionService', () => {
  let service: AchievementDefinitionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AchievementDefinitionService],
    }).compile();

    service = module.get<AchievementDefinitionService>(AchievementDefinitionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
