import { EChannelLeaveOption } from '../chat.interfaces';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * Dto for leaving a channel.
 * @property {number} userId - The ID of user leaving the channel.
 * @property {string} name - The name of the channel.
 * @property {EChannelLeaveOption} option [Optional] - Channel owner can decide DELETE or KEEP when they leave the channel.
 * @property {number} transferId [Optional] - To whom the ownership will be transferred. Only valid when owner leaving and wants to KEEP the channel.
 */

export class LeaveChannelDto {
  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsString()
  channelName: string;

  @IsOptional()
  @IsEnum(EChannelLeaveOption)
  option?: EChannelLeaveOption;

  @IsNumber()
  @IsOptional()
  transferId?: number;
}
