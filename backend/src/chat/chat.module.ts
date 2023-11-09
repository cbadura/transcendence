import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [ChatGateway, ChatService],
  imports: [UserModule, AuthModule],
})
export class ChatModule {}
