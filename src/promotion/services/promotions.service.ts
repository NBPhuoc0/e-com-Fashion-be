import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Promotion } from 'src/entities/promotion.entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import { PromotionDto } from '../dto/promotion.dto';
import { ProductsService } from 'src/products/service/products.service';
import { PromotionType } from 'src/common/interface';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PromotionUpdateDto } from '../dto/promotion-update.dto';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(Promotion)
    private promotionRepository: Repository<Promotion>,
    private productService: ProductsService,
  ) {}

  logger = new Logger('PromotionsService');

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkExpiredPromotions() {
    const promotions = await this.promotionRepository.find({
      where: {
        promotionStatus: true,
        promotionEndDate: LessThanOrEqual(new Date()),
      },
    });

    promotions.map(async (promotion) => {
      this.updateStatus(promotion);
    });
  }

  async createPromotion(dto: PromotionDto): Promise<Promotion> {
    // Create and save the promotion entity
    const promotion = this.promotionRepository.create(dto);

    promotion.products = [];

    // Find and update products with the promotion
    const productEntities = await this.productService.findProdsByIds(
      dto.products,
    );
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

    const res = await this.promotionRepository.save(promotion);
    res.promotionSlug =
      res.promotionName.toLowerCase().replace(' ', '-') + '-' + res.promotionId;
    return this.promotionRepository.save(res);
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

  async getPromotionWithOutProds(): Promise<Promotion[]> {
    return this.promotionRepository.find();
  }

  async getPromotionWithProdsById(id: number): Promise<Promotion> {
    return this.promotionRepository.findOne({
      where: { promotionId: id },
      relations: ['products'],
    });
  }

  async getPromotionById(promotionId: number): Promise<Promotion> {
    return this.promotionRepository.findOneBy({
      promotionId,
    });
  }

  async updatePromotion(
    id: number,
    dto: PromotionUpdateDto,
  ): Promise<Promotion> {
    return await this.promotionRepository.save({
      ...dto,
      promotionId: id,
    });
  }

  async updateStatus(promotion: Promotion): Promise<void> {
    await this.promotionRepository.update(promotion, {
      promotionStatus: !promotion.promotionStatus,
    });
    await this.productService.removePromotionFromProduct(promotion);
  }

  async remove(id: number): Promise<void> {
    const promotion = await this.getPromotionById(id);
    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }
    await this.productService.removePromotionFromProduct(promotion);
    this.promotionRepository.remove(promotion);
  }
}
