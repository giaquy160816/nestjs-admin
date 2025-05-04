import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, UseInterceptors, UploadedFile, HttpStatus, BadRequestException } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { ParseFilePipeBuilder } from '@nestjs/common/pipes';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
        return this.productService.update(id, updateProductDto);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        await this.productService.remove(id);
        return {
            status: 200,
            message: 'Product deleted successfully'
        };
    }

    @Get()
    findAll() {
        return this.productService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.productService.findOne(id);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File
    ) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        // Check JPEG signature (FF D8 FF)
        const signature = file.buffer.slice(0, 3);
        const isJPEG = signature[0] === 0xFF && signature[1] === 0xD8 && signature[2] === 0xFF;

        if (!isJPEG) {
            throw new BadRequestException('Only JPEG files are allowed');
        }

        console.log('file', file);
        return {
            status: 200,
            message: 'File uploaded successfully',
            filename: file.filename
        };
    }

}
