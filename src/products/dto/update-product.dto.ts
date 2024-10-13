import { ProductDto } from './product.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(ProductDto) {}
