import { ProductCategory } from 'src/entities/category.entity';
import { ProductVariant } from 'src/entities/product-variant.entity';
import { Promotion } from 'src/entities/promotion.entity';
import { Review } from 'src/entities/review.entity';

export class productdisplayDto {
  productId: number;
  productName: string;
  urlSlug: string;
  description: string;
  originPrice: number;
  promotionPrice: number;
  variants: ProductVariant[];
  category: ProductCategory;
  reviews: Review[];
  promotion: Promotion;
  createdAt: Date;
  updatedAt: Date;
}
