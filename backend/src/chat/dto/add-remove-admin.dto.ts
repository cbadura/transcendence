import {IsNumber, IsOptional, IsString} from 'class-validator';

/**
 * Dto for leaving a channel.
 * @property {number} userId - The ID of user who is being added/removed as admin.
 * @property {string} channelName - The name of the channel
 */

export class AddRemoveAdminDto {
  @IsString()
  channelName: string;

  @IsNumber()
  userId: number;

  @IsNumber({}, { each: true })
  @IsOptional()
  adminIds?: number[];

  @IsNumber()
  @IsOptional()
  ownerId?: number;
}
