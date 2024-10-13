import { IsArray, IsDate, IsNumber, IsString } from 'class-validator';
import { ProductVariantDto } from './product-variant.dto';
import { ReviewDto } from '../../users/dto/review.dto';

export class ProductDto {
  @IsString()
  productName: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsArray()
  variants: ProductVariantDto[];

  @IsNumber()
  categoryId: number;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
