import { IsNumber, IsString } from 'class-validator';

export class InviteToChannelDto {
  @IsString()
  channelName: string;

  @IsNumber()
  invitedUserId: number;
}
