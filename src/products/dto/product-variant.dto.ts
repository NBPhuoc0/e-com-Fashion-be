import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class ProductVariantDto {
  @ApiProperty({
    example: 'Đỏ',
  })
  @IsString()
  variantColor: string;

  @ApiProperty({
    example: '#ff0000',
  })
  @IsString()
  variantHex: string;

  @ApiProperty({
    example: [
      100, // S
      100, // M
      100, // L
      100, // XL
      100, // XXL
    ],
    isArray: true, // Specify that this is an array
  })
  @IsArray()
  listSize: [number];
}
