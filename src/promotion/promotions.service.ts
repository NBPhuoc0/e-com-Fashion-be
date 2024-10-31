import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Promotion } from 'src/entities/promotion.entity';
import { Repository } from 'typeorm';
import { promotionDto } from './dto/promotion.dto';
import { ProductsService } from 'src/products/service/products.service';
import { Product as number } from 'src/entities/product.entity';
import { PromotionType } from 'src/common/interface';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(Promotion)
    private promotionRepository: Repository<Promotion>,
    private productService: ProductsService,
  ) {}

  logger = new Logger('PromotionsService');

  async createPromotion(dto: promotionDto): Promise<Promotion> {
    const { products, ...promotionData } = dto;

    // Create and save the promotion entity
    const promotion = this.promotionRepository.create(dto);
    promotion.products = [];

    // Find and update products with the promotion
    const productEntities = await this.productService.findByIds(products);
    // this.logger.log({ productEntities });
    // if (productEntities.length === 0) {
    //   throw new NotFoundException('No products found for this promotion');
    // }
    // this.logger.log({ ...promotion });

    for (const productItem of productEntities) {
      productItem.promotionPrice = this.calculatePromotionPrice(
        productItem.price,
        promotion,
      );
      promotion.products.push(productItem);
    }

    return this.promotionRepository.save(promotion);
    // return promotion;
  }

  private calculatePromotionPrice(price: number, promotion: Promotion): number {
    const discountedPrice = price;
    switch (promotion.promotionType) {
      case PromotionType.NET:
        return Math.max(0, discountedPrice - promotion.promotionValue);
      case PromotionType.PERCENTAGE:
        const discount = (discountedPrice * promotion.promotionValue) / 100;
        return Math.max(
          0,
          discountedPrice -
            Math.min(discount, promotion.promotionMaxValue || discount),
        );
      case PromotionType.FLAT:
        return promotion.promotionValue;
      default:
        return discountedPrice;
    }
  }

  async getPromotions(): Promise<Promotion[]> {
    return this.promotionRepository.find({
      relations: ['products'],
    });
  }
}
