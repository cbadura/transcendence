import { EChannelLeaveOption } from '../chat.interfaces';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class leaveChannelDto {
  @IsNumber()
  userId: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(EChannelLeaveOption)
  option?: EChannelLeaveOption;

  @IsString()
  @IsOptional()
  transfer?: string;
}
