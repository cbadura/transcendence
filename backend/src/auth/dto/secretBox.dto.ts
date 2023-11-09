import { IsNumber, IsOptional, IsString } from "class-validator";

export class secretBoxDto {
  
  @IsNumber()
  id: number;

  // @IsNumber()
  // ftid: number;

  @IsString()
  tempSecret: string;
  
  @IsString()
  @IsOptional()
  secret?: string;
}