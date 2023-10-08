import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { EChannelMode } from '../chat.interfaces';

export class CreateChannelDto {
  @IsNumber()
  ownerId: number;

  @IsString()
  name: string;

  @IsEnum(EChannelMode)
  mode: EChannelMode;

  @IsString()
  @IsOptional()
  password?: string;
}
