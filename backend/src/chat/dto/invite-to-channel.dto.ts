import { IsNumber, IsString } from 'class-validator';

export class InviteToChannelDto {
  @IsNumber()
  userId: number;

  @IsString()
  channel: string;

  @IsNumber()
  invitedUserId: number;
}
