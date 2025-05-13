import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsNumber,
    Min,
    Max,
    IsArray,
    IsInt,
    IsBoolean,
} from 'class-validator';

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber()
    @Min(0)
    @Max(10000000)
    price: number;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    album?: string[];

    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    categories?: number[]; // List of category IDs
}