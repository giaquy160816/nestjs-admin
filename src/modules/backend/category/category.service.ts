import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category) private categoryRepository: Repository<Category>,
        @InjectDataSource() private pgDataSource: DataSource,
    ) {}

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const category = this.categoryRepository.create(createCategoryDto);
        return await this.categoryRepository.save(category);
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
        }
        return await this.categoryRepository.save({ ...category, ...updateCategoryDto });
    }

    async remove(id: number) {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
        }
        return await this.categoryRepository.delete(id);
    }

    async findAll() {
        return await this.categoryRepository.find();
    }

    async findOne(id: number) {
        if (isNaN(id)) {
            throw new HttpException('Invalid category ID', HttpStatus.BAD_REQUEST);
        }
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {    
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
        }
        return category;
    }


}
