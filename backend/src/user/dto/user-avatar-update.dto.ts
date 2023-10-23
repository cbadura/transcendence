import { IsNumber, IsString } from 'class-validator';

export class UserAvatarUpdateDto {
  @IsNumber()
  userId: number;

  @IsString()
  avatar: string;
}
