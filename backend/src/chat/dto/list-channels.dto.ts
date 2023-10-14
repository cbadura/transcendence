import { EChannelMode, EUserRole } from '../chat.interfaces';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ChannelUserDto {
  @IsNumber()
  id: number;

  @IsBoolean()
  isBanned: boolean;

  @IsBoolean()
  isMuted: boolean;

  @IsNumber()
  @IsOptional()
  banExpTime?: number;

  @IsNumber()
  @IsOptional()
  muteExpTime?: number;
}

/**
 * Dto for channel information sent to a user.
 * @property {string} name - The name of the channel.
 * @property {EChannelMode} mode - PUBLIC, PRIVATE, or PROTECTED.
 * @property {EUserRole} role - The user's role in this channel.
 * @property {ChannelUserDto[]} users - List of users in this channel.
 */

export class ChannelDto {
  @IsString()
  name: string;

  @IsEnum(EChannelMode)
  mode: EChannelMode;

  @IsEnum(EUserRole)
  role: EUserRole;

  users: ChannelUserDto[];
}

export class ListChannelsDto {
  channels: ChannelDto[];
}
