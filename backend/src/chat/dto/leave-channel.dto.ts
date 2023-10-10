import { EChannelLeaveOption } from '../chat.interfaces';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

// userId not needed from frontend;
// but must be sent from backend in responce;
export class leaveChannelDto {
  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsString()
  channelName: string;

  @IsOptional()
  @IsEnum(EChannelLeaveOption)
  option?: EChannelLeaveOption;

  @IsString()
  @IsOptional()
  transfer?: string;
}
