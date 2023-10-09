import { EChannelMode, EUserRole } from '../chat.interfaces';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class ChannelUserDto {
  @IsString()
  name: string;

  @IsNumber()
  id: number;
}

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
