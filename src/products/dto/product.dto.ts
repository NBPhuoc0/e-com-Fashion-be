import { IsArray, IsDate, IsNumber, IsString } from 'class-validator';
import { ProductVariantDto } from './product-variant.dto';
import { ReviewDto } from '../../users/dto/review.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty({
    example: 'Áo thun nam',
  })
  @IsString()
  productName: string;

  @ApiProperty({
    example: 'Áo thun nam vip pro no1',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 150000,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: [
      {
        variantColor: 'Đỏ',
        listSize: [100, 100, 100, 100, 100],
      },
      {
        variantColor: 'Xanh',
        listSize: [100, 100, 100, 100, 100],
      },
    ],
  })
  @IsArray()
  variants: ProductVariantDto[];

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  categoryId: number;
}
