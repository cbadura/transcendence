import {IsBoolean, IsNumber, IsOptional, IsString} from 'class-validator';

/**
 * Dto for joining a channel.
 * @property {string} channelName - The name of the channel to join.
 * @property {number} userId [Optional] - The ID of the user requesting to join the channel. Must be sent as confirmation.
 * @property {string} password [Optional] - The password for protected channel.
 * @property {number[]} channelUsersIds [Optional] - List of channel users id. Must be sent as confirmation.
 */

export class JoinChannelDto {
  @IsString()
  channelName: string;

  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsString()
  @IsOptional()
  password?: string;

  @IsOptional()
  channelUsersIds?: number[];

  @IsBoolean()
  @IsOptional()
  isMuted?: boolean;

  @IsNumber()
  @IsOptional()
  muteExpTime?: number;
}
