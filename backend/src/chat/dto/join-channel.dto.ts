import { IsOptional, IsString } from 'class-validator';

export class JoinChannelDto {
  @IsString()
  channelName: string;

  @IsString()
  @IsOptional()
  password?: string;
}
