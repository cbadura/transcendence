import { IsNumber, IsOptional, IsString } from 'class-validator';

export class MessageDto {
  @IsString()
  @IsOptional()
  timestamp?: string;

  @IsString()
  message: string;

  @IsNumber()
  @IsOptional()
  senderId?: number;

  @IsString()
  @IsOptional()
  senderName?: string;

  @IsString()
  @IsOptional()
  senderColor?: string;

  @IsString()
  @IsOptional()
  senderAvatar?: string;

  @IsString()
  @IsOptional()
  channel?: string;

  @IsNumber()
  @IsOptional()
  receiverId?: number;
}
