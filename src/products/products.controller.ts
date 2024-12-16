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
import { PagingDto } from './dto/paging.dto';

@Controller('products')
@ApiTags('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  logger = new Logger('ProductsController');

  @Get('all')
  findAll(@Query() dto: PagingDto) {
    return this.productsService.findAll(dto.page, dto.skip);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productsService.findOneProd(+id);
  }

  @Get('ansestors/:id')
  finAnsestors(@Param('id') id: number) {
    return this.categoriesService.findAncestors(+id);
  }

  @Get('categories/:id')
  findAllProductWithCategories(
    @Query() dto: PagingDto,
    @Param('id') categoryId: number,
  ) {
    return this.productsService.findByCategoryId(
      categoryId,
      +dto.page,
      +dto.skip,
      +dto.priceOption,
      dto.order,
    );
  }

  @Get('promotions/:id')
  findAllProductWithPromotions(
    @Query() dto: PagingDto,
    @Param('id') promotionId: number,
  ) {
    return this.productsService.findByPromotionId(
      promotionId,
      dto.page,
      dto.skip,
      dto.priceOption,
      dto.order,
    );
  }

  @Get('search')
  findByNames(@Query() dto: PagingDto) {
    return this.productsService.findByProductName(
      dto.keyword,
      dto.page,
      dto.skip,
    );
  }
}
