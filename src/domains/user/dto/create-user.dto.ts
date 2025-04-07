import { IsEmail, IsNotEmpty, IsString, IsOptional, IsDate, IsEnum } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    fullName: string;

    @IsOptional()
    @IsDate()
    dob?: Date;

    @IsOptional()
    @IsEnum(['male', 'female'])
    gender?: string;

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    password?: string;
}
