import { IsNumber, IsOptional, IsString } from 'class-validator';

export class MessageDto {
  @IsNumber()
  timestamp: number;

  @IsString()
  message: string;

  @IsNumber()
  userId: number;

  @IsString()
  @IsOptional()
  channel?: string;

  @IsNumber()
  @IsOptional()
  receiverId?: number;
}
