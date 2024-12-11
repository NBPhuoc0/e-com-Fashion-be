import { IsNumber } from 'class-validator';
import { ProductVariant } from 'src/entities/product-variant.entity';

export class OrderDetailDto {
  constructor(productVariant: ProductVariant, quantity: number) {
    this.productVariant = productVariant;
    const product = productVariant.product;
    this.productId = product.productId;
    this.price = product.price;
    this.promotionPrice = product.promotionPrice;
    this.quantity = quantity;
  }
  productVariant: ProductVariant;

  productId: number;

  price: number;

  promotionPrice: number;

  quantity: number;
}
