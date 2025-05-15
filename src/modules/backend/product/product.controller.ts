import {
    Body,
    Controller,
    Post,
    Put,
    Param,
    Get,
    Delete,
    Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Public } from 'src/decorators/public.decorator';
import { UseDatabaseToken } from 'src/common/decorators/use-database-token.decorator';

@Controller()
@Public()
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post('reindex')
    async reindexAll() {
        return this.productService.reindexAllToES();
    }

    @Post()
    create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
        return this.productService.update(id, updateProductDto);
    }

    @Get('search')
    search(@Query('q') q: string) {
        return this.productService.searchProducts(q);
    }

    @Get()
    findAll() {
        return this.productService.findAll();
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.productService.delete(id);
    }

    @Delete('es/:id')
    async deleteFromElastic(@Param('id') id: number) {
        return this.productService.removeProduct(id);
    }

    @Delete('delete-by-content/:id')
    async deleteByContent(@Param('id') id: number) {
        return this.productService.forceDeleteByContent(id);
    }
}