import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UserDataUpdateDto {
  @IsNumber()
  userId: number;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  name?: string;
}
