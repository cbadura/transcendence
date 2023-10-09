import { InviteToChannelDto } from './invite-to-channel.dto';
import { IsNumber } from 'class-validator';

export class BanMuteFromChannelDto extends InviteToChannelDto {
  @IsNumber()
  expirationTimestamp: number;
}
