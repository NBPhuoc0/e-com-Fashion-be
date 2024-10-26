import { Controller, Post, Body } from '@nestjs/common';
import { ProductsService } from './service/products.service';
import { ProductDto } from './dto/product.dto';
import { CategoriesService } from './service/product-categories.service';
import { ProductVariantsService } from './service/product-variants.service';
import { S3ClientService } from '../common/s3-client/s3-client.service';
import { ApiTags } from '@nestjs/swagger';
import { CategoryDto } from './dto/category.dto';

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

  @Post('categories')
  createCategory(@Body() createCategoryDto: CategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }
}
