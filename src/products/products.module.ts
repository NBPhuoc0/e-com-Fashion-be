import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductVariant } from 'src/entities/product-variant.entity';
import { Product } from 'src/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Review } from 'src/entities/review.entity';
import { S3ClientModule } from 'src/common/s3-client/s3-client.module';
import { CategoriesService } from './categories.service';
import { ProductVariantsService } from './product-variant.service';
import { Photo } from 'src/entities/photo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductVariant,
      Category,
      Review,
      Photo,
    ]),
    S3ClientModule,
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
