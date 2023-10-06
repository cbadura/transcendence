import { Injectable } from '@nestjs/common';
import { Post } from './IPost';

@Injectable()
export class ChatService {

  
  async retrieveChatHistory(room: string): Promise<Post[]> {
    /*fetch chat history from db*/
    return [];
  }

}
