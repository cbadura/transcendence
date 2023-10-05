import { Test, TestingModule } from '@nestjs/testing';
import { AchievementDefinitionController } from './achievement-definition.controller';

describe('AchievementDefinitionController', () => {
  let controller: AchievementDefinitionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AchievementDefinitionController],
    }).compile();

    controller = module.get<AchievementDefinitionController>(AchievementDefinitionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
