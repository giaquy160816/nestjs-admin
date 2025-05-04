import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../category/entities/category.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) {}

    async create(createProductDto: CreateProductDto) {
        // If categories are provided as an array of IDs
        if (createProductDto.categories && Array.isArray(createProductDto.categories)) {
            // Check if categories are provided as array of numbers (IDs)
            if (typeof createProductDto.categories[0] === 'number') {
                const categoryIds = createProductDto.categories as unknown as number[];
                const categories = await this.categoryRepository.find({
                    where: { id: In(categoryIds) }
                });

                if (categories.length !== categoryIds.length) {
                    throw new HttpException('Some categories were not found', HttpStatus.BAD_REQUEST);
                }

                // Replace the array of IDs with actual category entities
                createProductDto.categories = categories;
            }
            // If categories are already provided as objects with IDs, TypeORM will handle it
        }

        return await this.productRepository.save(createProductDto);
    }

    async update(id: number, updateProductDto: UpdateProductDto) {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['categories']
        });

        if (!product) {
            throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
        }

        // Handle categories if they are provided as an array of IDs
        if (updateProductDto.categories && Array.isArray(updateProductDto.categories)) {
            if (typeof updateProductDto.categories[0] === 'number') {
                const categoryIds = updateProductDto.categories as unknown as number[];
                const categories = await this.categoryRepository.find({
                    where: { id: In(categoryIds) }
                });

                if (categories.length !== categoryIds.length) {
                    throw new HttpException('Some categories were not found', HttpStatus.BAD_REQUEST);
                }

                // Replace the array of IDs with actual category entities
                updateProductDto.categories = categories;
            }
        }

        // Merge the product with the update DTO
        const updatedProduct = { ...product, ...updateProductDto };

        // Save the updated product
        return await this.productRepository.save(updatedProduct);
    }

    async remove(id: number) {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
        }
        return await this.productRepository.delete(id);
    }

    async findAll() {
        return await this.productRepository.find({
            relations: ['categories']
        });
    }

    async findOne(id: number) {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['categories']
        });
        if (!product) {
            throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
        }
        return product;
    }
}
