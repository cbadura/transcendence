import { IsNotEmpty,IsOptional,IsString, IsHexColor, IsNumber, IsBoolean } from "class-validator";

export class CreateUserDto {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  @IsOptional()
  ftid: number;

  @IsBoolean()
  tfa: boolean;

  @IsOptional()
  @IsString()
  avatar: string;

  @IsNotEmpty()
  @IsHexColor()
  @IsOptional()
  color: string;

  level: number;

  matches: number;

  wins: number;
}
