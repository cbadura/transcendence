import { IsNumber, IsString } from 'class-validator';

export class DeleteChannelDto {
  @IsNumber()
  userId: number;

  @IsString()
  name: string;
}
