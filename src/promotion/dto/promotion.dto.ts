import { PromotionType } from 'src/common/interface';
import {
  IsString,
  IsDate,
  IsEnum,
  IsArray,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class promotionDto {
  @IsString()
  @ApiProperty({
    example: 'Summer Sale',
    description: 'The name of the promotion',
  })
  promotionName: string;

  @IsString()
  @ApiProperty({
    example: 'Discount on summer collection',
    description: 'The description of the promotion',
  })
  promotionDescription: string;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    example: '2023-06-01T00:00:00.000Z',
    description: 'The start date of the promotion',
  })
  promotionStartDate: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    example: '2023-06-30T23:59:59.999Z',
    description: 'The end date of the promotion',
  })
  promotionEndDate: Date;

  @IsEnum(PromotionType)
  @ApiProperty({
    example: PromotionType.PERCENTAGE,
    description: 'The type of the promotion',
  })
  promotionType: PromotionType;

  @IsArray()
  @ApiProperty({
    example: [1, 2, 5],
    description: 'The list of products included in the promotion',
  })
  products: [];

  @IsNumber()
  @ApiProperty({
    example: 20,
    description: 'The value of the promotion',
  })
  promotionValue: number;

  @IsNumber()
  @ApiProperty({
    example: 50000,
    description: 'The maximum value of the promotion',
  })
  @IsOptional()
  promotionMaxValue: number;
}
