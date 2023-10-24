import { IsNotEmpty,IsOptional,IsString, IsHexColor, IsNumber, IsBoolean } from "class-validator";

export class CreateUserDto {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  @IsOptional()
  ftid: number;

  @IsBoolean()
  tfa: boolean=false;

  @IsOptional()
  @IsString()
  avatar: string=`http://localhost:3000/users/profilepic/default_0${Math.floor(Math.random() * 100 % 5)}.jpg`;

  @IsNotEmpty()
  @IsHexColor()
  @IsOptional()
  color: string='#E7C9FF';

  level: number=1.00;

  matches: number=0;

  wins: number=0;
}
