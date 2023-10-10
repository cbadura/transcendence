import { IsString } from 'class-validator';

export class DeleteChannelDto {
  @IsString()
  channelName: string;
}
