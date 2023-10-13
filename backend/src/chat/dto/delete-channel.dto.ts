import { IsString } from 'class-validator';

/**
 * Dto for deleting a channel.
 * @property {number} userId - The ID of user trying to delete a channel.
 * @property {string} name - The name of channel being deleted.
 */
export class DeleteChannelDto {
  @IsString()
  channelName: string;
}
