import { IsNotEmpty,IsOptional,IsString, IsHexColor } from "class-validator";

export class CreateUserDto {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  avatar: string;

  @IsNotEmpty()
  @IsHexColor()
  @IsOptional()
  color: string='#E7C9FF';

  level: number=1.00;

  matches: number=0;

  wins: number=0;
}
