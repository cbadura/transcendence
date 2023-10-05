import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional,IsHexColor } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    
    @IsOptional()
    name: string;
    
    avatar: string; //should not be changeable by users. Will be set automatically to either default or user uploaded profile

    @IsHexColor()
    @IsOptional()
    color: string; 
}
