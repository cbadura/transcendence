import { IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * Dto for inviting user to a channel.
 * @property {number} userId - The ID of user initiating the invitation.
 * @property {string} channel - The name of the channel.
 * @property {number} invitedUserId - The ID of user being invited.
 */

export class InviteToChannelDto {
  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsString()
  channelName: string;

  @IsNumber()
  targetUserId: number;
}
