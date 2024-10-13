import {
  IsString,
  IsNumber,
  IsEnum,
  IsArray,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { ProductSize } from 'src/common/enum';

export class ProductVariantDto {
  @IsString()
  colorName: string;

  @IsEnum(ProductSize)
  size: ProductSize;

  @IsNumber()
  stockQuantity: number;
}
