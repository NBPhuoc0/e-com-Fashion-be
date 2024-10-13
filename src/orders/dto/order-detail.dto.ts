import { IsNumber } from 'class-validator';

export class OrderDetailDto {
  @IsNumber()
  productVariantId: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;
}
