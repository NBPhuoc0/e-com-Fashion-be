import { Controller, Post, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/product.dto';
import { CategoriesService } from './categories.service';
import { ProductVariantsService } from './product-variant.service';
import { S3ClientService } from '../common/s3-client/s3-client.service';
import { ApiTags } from '@nestjs/swagger';

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
}
