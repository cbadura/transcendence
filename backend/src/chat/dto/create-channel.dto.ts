import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { EChannelMode } from '../chat.interfaces';

/**
 * Dto for creating channel.
 * @property {number} ownerId [Optional] - Only valid when client receives channel create confirmation from server.
 * @property {string} channelName - The name of the channel to create.
 * @property {EChannelMode} mode - PUBLIC, PROTECTED or PRIVATE.
 * @property {string} password [Optional] - The password for protected channel.
 */
export class CreateChannelDto {
  @IsNumber()
  @IsOptional()
  ownerId?: number;

  @IsString()
  channelName: string;

  @IsEnum(EChannelMode)
  mode: EChannelMode;

  @IsString()
  @IsOptional()
  password?: string;
}
