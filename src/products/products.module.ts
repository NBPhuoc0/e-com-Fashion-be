import { Module } from '@nestjs/common';
import { ProductsService } from './service/products.service';
import { ProductsController } from './products.controller';
import { ProductVariant } from 'src/entities/product-variant.entity';
import { Product } from 'src/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory } from 'src/entities/category.entity';
import { Review } from 'src/entities/review.entity';
import { CategoriesService } from './service/product-categories.service';
import { ProductVariantsService } from './service/product-variants.service';
import { Photo } from 'src/entities/photo.entity';
import { ProductVariantSizeStock } from 'src/entities/product-variant-size-stock.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductVariant,
      ProductVariantSizeStock,
      ProductCategory,
      Review,
      Photo,
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, CategoriesService, ProductVariantsService],
  exports: [
    ProductVariantsService,
    ProductsService,
    CategoriesService,
    TypeOrmModule,
  ],
})
export class ProductsModule {}
