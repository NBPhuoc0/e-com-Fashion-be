import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/product.dto';
import { CategoriesService } from './categories.service';
import { ReviewsService } from './review.service';
import { ProductVariantsService } from './product-variant.service';
import { S3 } from '@aws-sdk/client-s3';
import { S3ClientService } from 'src/common/s3-client/s3-client.service';
import { ApiTags } from '@nestjs/swagger';
@Controller('products')
@ApiTags('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
    private readonly reviewsService: ReviewsService,
    private readonly productVariantsService: ProductVariantsService,
    private readonly s3ClientService: S3ClientService,
  ) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.s3ClientService.getPresignedSignedUrl(id);
  }
}
