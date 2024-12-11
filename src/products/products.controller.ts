import {
  Controller,
  Post,
  Body,
  HttpException,
  InternalServerErrorException,
  Get,
  Query,
  UseInterceptors,
  UploadedFiles,
  Param,
  Logger,
} from '@nestjs/common';
import { ProductsService } from './service/products.service';
import { ProductDto } from './dto/product.dto';
import { CategoriesService } from './service/product-categories.service';
import { ApiTags } from '@nestjs/swagger';
import { CategoryDto } from './dto/category.dto';

@Controller('products')
@ApiTags('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  logger = new Logger('ProductsController');

  @Post()
  create(@Body() createProductDto: ProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get('products')
  findAll(@Query('page') page: number, @Query('skip') skip: number) {
    return this.productsService.findAll(page, skip);
  }

  @Post('categories')
  createCategory(@Body() createCategoryDto: CategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get('categories')
  findAllCategories() {
    return this.categoriesService.findAll();
  }

  @Get('categories/tree')
  findTree() {
    return this.categoriesService.findTree();
  }

  @Get('categories/:id')
  findCategory(@Param('id') id: number) {
    return this.categoriesService.findOne(id);
  }
}
