import { IsNumber, IsString } from 'class-validator';

export class UserNameUpdateDto {
  @IsNumber()
  userId: number;

  @IsString()
  name: string;
}
