import { Injectable } from '@nestjs/common';
import { EChannelMode, IChannel } from './IChannel';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UserService } from '../user/user.service';
import { User } from '../entities/user.entity';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ChatService {
  channels: IChannel[];

  constructor(readonly userService: UserService) {}

  async createChannel(channelDto: CreateChannelDto): Promise<IChannel> {
    const userOwner: User = await this.userService.getUser(channelDto.ownerId);
    if (userOwner === undefined) throw new WsException('Invalid channel owner');
    let channel: IChannel;
    channel.name = channelDto.name;
    channel.owner = userOwner;
    channel.users.push(userOwner);
    channel.mode = channelDto.mode;
    if (channel.mode === EChannelMode.PROTECTED) {
      channel.password = channelDto.password;
      if (channel.password === undefined)
        throw new WsException(
          'Missing channel password for a protected channel',
        );
    }
    if (this.channels.find((ch) => channel.name === ch.name))
      throw new WsException('Channel with this name already exists');
    if (!Object.values(EChannelMode).includes(channel.mode))
      throw new WsException("Channel mode doesn't exist");
    this.channels.push(channel);
    //// notify here all users about new channel creation
    return channel;
  }
}
