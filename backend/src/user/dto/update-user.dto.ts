import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional,IsHexColor, IsBoolean } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    
    @IsOptional()
    name: string;
    
    @IsOptional()
    avatar: string; //should not be changeable by users. Will be set automatically to either default or user uploaded profile

    @IsHexColor()
    @IsOptional()
    color: string; 

    @IsBoolean()
    @IsOptional()
    tfa: boolean;
}
