import { Module } from '@nestjs/common';
import { NetworkGameGateway } from './network-game.gateway';

@Module({
  providers: [NetworkGameGateway]
})
export class NetworkGameModule {}
