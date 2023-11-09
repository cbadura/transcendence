import { Module } from '@nestjs/common';
import { NetworkGameGateway } from './network-game.gateway';
import { NetworkGameService } from './network-game.service';
import { UserModule } from 'src/user/user.module';
import { MatchModule } from 'src/match/match.module';

@Module({
  providers: [NetworkGameGateway, NetworkGameService],
  imports: [UserModule,MatchModule]
})
export class NetworkGameModule {}
