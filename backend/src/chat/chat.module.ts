import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { UserModule } from '../user/user.module';

@Module({
  providers: [ChatGateway, ChatService],
  imports: [UserModule],
})
export class ChatModule {}
