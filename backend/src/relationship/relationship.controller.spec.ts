import { Test, TestingModule } from '@nestjs/testing';
import { RelationshipController } from './relationship.controller';

describe('RelationshipController', () => {
  let controller: RelationshipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RelationshipController],
    }).compile();

    controller = module.get<RelationshipController>(RelationshipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
