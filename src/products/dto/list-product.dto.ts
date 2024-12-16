import { Product } from 'src/entities/product.entity';

export class ListProductDto {
  data: Product[];
  count: number;
}
