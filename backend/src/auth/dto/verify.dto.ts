import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class verifyDto {
  @IsBoolean()
  verified: boolean;
  
  @IsString()
  @IsOptional()
  access_token?: string;
}