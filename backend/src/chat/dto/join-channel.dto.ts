import { IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * Dto for joining a channel.
 * @property {string} channelName - The name of the channel to join.
 * @property {number} userId - The ID of the user requesting to join the channel.
 * @property {string} password [Optional] - The password for protected channel.
 */
// userId not needed from frontend;
// but must be sent from backend in response;
export class JoinChannelDto {
  @IsString()
  channelName: string;

  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsString()
  @IsOptional()
  password?: string;
}
