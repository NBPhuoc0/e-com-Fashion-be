import {
  IsString,
  IsOptional,
  IsArray,
  IsDate,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @IsString()
  @ApiProperty({
    example: 'Nam',
    description: 'The name of the category',
  })
  categoryName: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'The id of the parent category',
  })
  parent?: number;
}
