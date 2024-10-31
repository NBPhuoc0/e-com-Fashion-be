import {
  Controller,
  Post,
  Body,
  HttpException,
  InternalServerErrorException,
  Get,
  Query,
} from '@nestjs/common';
import { ProductsService } from './service/products.service';
import { ProductDto } from './dto/product.dto';
import { CategoriesService } from './service/product-categories.service';
import { ProductVariantsService } from './service/product-variants.service';
import { S3ClientService } from '../common/s3-client/s3-client.service';
import { ApiTags } from '@nestjs/swagger';
import { CategoryDto } from './dto/category.dto';
import { QueryFailedError } from 'typeorm';

@Controller('products')
@ApiTags('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
    private readonly productVariantsService: ProductVariantsService,
    private readonly s3ClientService: S3ClientService,
  ) {}

  @Post()
  create(@Body() createProductDto: ProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get('products')
  findAll() {
    return this.productsService.findAll();
  }

  @Post('categories')
  createCategory(@Body() createCategoryDto: CategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get('categories')
  findAllCategories() {
    return this.categoriesService.findAll();
  }

  @Get('categories/:id')
  findOneCategory(@Query('id') id: number) {
    return this.categoriesService.getParent(id);
  }
}
