import { Test, TestingModule } from '@nestjs/testing';
import { NetworkGameGateway } from './network-game.gateway';

describe('NetworkGameGateway', () => {
  let gateway: NetworkGameGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NetworkGameGateway],
    }).compile();

    gateway = module.get<NetworkGameGateway>(NetworkGameGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
