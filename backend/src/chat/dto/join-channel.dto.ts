import { IsNumber, IsOptional, IsString } from 'class-validator';

export class JoinChannelDto {
  @IsString()
  channelName: string;

  @IsNumber()
  userId: number;

  @IsString()
  @IsOptional()
  password?: string;
}
