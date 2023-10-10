import { IsNumber, IsOptional, IsString } from 'class-validator';

// userId not needed from frontend;
// but must be sent from backend in responce;
export class InviteToChannelDto {
  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsString()
  channelName: string;

  @IsNumber()
  invitedUserId: number;
}
