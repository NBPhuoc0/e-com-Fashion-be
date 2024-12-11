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
import { VoucherType } from 'src/common/interface';

export class VoucherDto {
  @IsString()
  @ApiProperty({
    example: 'Summer Sale',
    description: 'The name of the voucher',
  })
  voucherName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'summer-sale',
    description: 'The code of the voucher',
  })
  voucherCode: string;

  @IsString()
  @ApiProperty({
    example: 'Discount on summer collection',
    description: 'The description of the voucher',
  })
  voucherDescription: string;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    example: '2023-06-01T00:00:00.000Z',
    description: 'The start date of the voucher',
  })
  voucherStartDate: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    example: '2023-06-30T23:59:59.999Z',
    description: 'The end date of the voucher',
  })
  voucherEndDate: Date;

  @IsNumber()
  @ApiProperty({
    example: 100,
    description: 'The usage limit of the voucher',
  })
  usageLimit: number;

  @IsEnum(VoucherType)
  @ApiProperty({
    example: VoucherType.PERCENTAGE,
    description: 'The type of the voucher',
  })
  voucherType: VoucherType;

  @IsNumber()
  @ApiProperty({
    example: 20,
    description: 'The value of the voucher',
  })
  voucherValue: number;

  @IsNumber()
  @ApiProperty({
    example: 50000,
    description: 'The maximum value of the voucher',
  })
  @IsOptional()
  voucherMaxValue: number;
}
