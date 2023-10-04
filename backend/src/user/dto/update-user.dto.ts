import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional,IsHexColor } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    
    @IsOptional()
    name: string;
    
    @IsOptional()
    avatar: string;

    @IsHexColor()
    @IsOptional()
    color: string;
}
