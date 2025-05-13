import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../category/entities/category.entity';
import { SearchProductService } from './searchproduct.service';

import { CustomElasticsearchModule } from 'src/elasticsearch/elasticsearch.module';


@Module({
    imports: [
        TypeOrmModule.forFeature([Product, Category]),
        CustomElasticsearchModule,
    ],
    controllers: [ProductController],
    providers: [ProductService, SearchProductService],
})

export class ProductModule { }
