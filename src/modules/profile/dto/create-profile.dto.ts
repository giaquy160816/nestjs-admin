import { IsNotEmpty, IsString, IsOptional, IsDate, IsPositive, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProfileDto {
    @IsNotEmpty()
    @IsString()
    avatar: string;

    @IsNotEmpty()
    @IsString()
    gender: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    dob?: Date;

    @IsOptional()
    @IsInt()
    @IsPositive()
    userId?: number;
    
}
