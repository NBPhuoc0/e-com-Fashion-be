import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags } from '@nestjs/swagger';
import { ProductsService } from 'src/products/products.service';
import { CategoriesService } from 'src/products/categories.service';
import { ProductVariantsService } from 'src/products/product-variant.service';
import { S3ClientService } from 'src/common/s3-client/s3-client.service';
import { ProductDto } from 'src/products/dto/product.dto';
import { CategoryDto } from 'src/products/dto/category.dto';

@Controller('admin')
@ApiTags('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
    private readonly productVariantsService: ProductVariantsService,
    private readonly s3ClientService: S3ClientService,
  ) {}

  @Post('products')
  createProduct(@Body() createProductDto: ProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Post('categories')
  createCategory(@Body() createCategoryDto: CategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Patch('categories/:id')
  updateCategory(
    @Param('id') id: number,
    @Body() updateCategoryDto: CategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Get('categories')
  getCategories() {
    return this.categoriesService.findAll();
  }
}
