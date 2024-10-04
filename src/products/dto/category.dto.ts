import {
  IsString,
  IsOptional,
  IsArray,
  IsDate,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CategoryDto {
  @IsNumber()
  categoryId: number;

  @IsString()
  categoryName: string;

  @IsOptional()
  @IsArray()
  @Type(() => CategoryDto)
  children?: CategoryDto[];

  @IsOptional()
  @Type(() => CategoryDto)
  parent?: CategoryDto;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
