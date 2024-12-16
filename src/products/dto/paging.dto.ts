import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PagingDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
    example: 0,
    description: 'The page number',
  })
  page: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
    example: 10,
    description: 'The number of items per page',
  })
  skip: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
    example: 1,
    description: 'The price option',
  })
  priceOption: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    example: 'ASC',
    description: 'The order',
  })
  order: string;

  @IsOptional()
  @IsString()
  keyword: string;
}
