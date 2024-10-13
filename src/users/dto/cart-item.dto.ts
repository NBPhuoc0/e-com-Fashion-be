import { ApiProperty } from '@nestjs/swagger';

export class CartItemDto {
  @ApiProperty({
    example: 1,
    description: 'The product variant ID',
  })
  productVariantId: number;

  @ApiProperty({
    example: 1,
    description: 'The quantity of the product variant',
  })
  quantity: number;
}
