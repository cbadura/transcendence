import { IsNumber, IsOptional, IsString } from 'class-validator';

// userId not needed from frontend;
// but must be sent from backend in responce;
export class JoinChannelDto {
  @IsString()
  channelName: string;

  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsString()
  @IsOptional()
  password?: string;
}
