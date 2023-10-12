import { Test, TestingModule } from '@nestjs/testing';
import { NetworkGameService } from './network-game.service';

describe('NetworkGameService', () => {
  let service: NetworkGameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NetworkGameService],
    }).compile();

    service = module.get<NetworkGameService>(NetworkGameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
