import { EChannelLeaveOption } from '../chat.interfaces';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class leaveChannelDto {
  @IsString()
  channelName: string;

  @IsOptional()
  @IsEnum(EChannelLeaveOption)
  option?: EChannelLeaveOption;

  @IsString()
  @IsOptional()
  transfer?: string;
}
