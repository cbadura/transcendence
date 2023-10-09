import { IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * Dto for joining a channel.
 * @property {string} channelName - The name of the channel to join.
 * @property {number} userId - The ID of the user requesting to join the channel.
 * @property {string} password [Optional] - The password for protected channel.
 */
export class JoinChannelDto {
  @IsString()
  channelName: string;

  @IsNumber()
  userId: number;

  @IsString()
  @IsOptional()
  password?: string;
}
