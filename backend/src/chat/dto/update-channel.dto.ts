import { CreateChannelDto } from './create-channel.dto';
import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';

export class UpdateChannelDto extends PartialType(CreateChannelDto) {
  @IsString()
  currName: string;
}
