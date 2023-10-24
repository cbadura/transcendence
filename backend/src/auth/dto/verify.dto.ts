import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class verifyDto {
  @IsBoolean()
  verified: boolean;

  @IsNumber()
  id: number;
  
  @IsNumber()
  ftid: number;
  
  @IsString()
  @IsOptional()
  access_token?: string;
}