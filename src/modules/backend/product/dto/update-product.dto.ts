import { PickType } from '@nestjs/mapped-types';
import { Product } from '../entities/product.entity';

export class UpdateProductDto extends PickType(
    Product, [
        'name', 'description', 'price', 'image', 'categories'
    ] as const
) {}
