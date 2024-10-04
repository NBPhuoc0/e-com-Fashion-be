import { IsArray, IsDate, IsNumber, IsString } from 'class-validator';
import { ProductVariantDto } from './product-variant.dto';
import { ReviewDto } from './review.dto';

export class ProductDto {
  @IsNumber()
  productId: number;

  @IsString()
  productName: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  stockQuantity: number;

  @IsArray()
  variants: ProductVariantDto[];

  @IsNumber()
  categoryId: number;

  @IsArray()
  reviews: ReviewDto[];

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
