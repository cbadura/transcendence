import { IsNumber, IsOptional, IsString } from 'class-validator';

export class MessageDto {
  @IsNumber()
  timestamp: number;

  @IsString()
  message: string;

  @IsNumber()
  @IsOptional()
  userId?: number;
  // we might need to send userId to frontend,
  // but we don't need to receive it from frontend

  @IsString()
  @IsOptional()
  channel?: string;

  @IsNumber()
  @IsOptional()
  receiverId?: number;
}
