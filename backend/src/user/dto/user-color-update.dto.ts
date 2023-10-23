import { IsNumber, IsString } from 'class-validator';

export class UserColorUpdateDto {
  @IsNumber()
  userId: number;

  @IsString()
  color: string;
}
