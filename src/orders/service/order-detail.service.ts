import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetail } from 'src/entities/order-detail.entity';
import { Repository } from 'typeorm';
import { OrderDetailDto } from '../dto/order-detail.dto';

@Injectable()
export class OrderDetailService {
  constructor(
    @InjectRepository(OrderDetail)
    private orderDetailsRepository: Repository<OrderDetail>,
  ) {}

  create(dto: OrderDetailDto): OrderDetail {
    return this.orderDetailsRepository.create(dto);
  }

  async findAll(): Promise<OrderDetail[]> {
    return this.orderDetailsRepository.find();
  }

  async findOne(orderDetailsId: number): Promise<OrderDetail> {
    return this.orderDetailsRepository.findOneBy({ orderDetailsId });
  }

  async update(
    orderDetailsId: number,
    dto: Partial<OrderDetailDto>,
  ): Promise<OrderDetail> {
    await this.orderDetailsRepository.update(orderDetailsId, dto);
    return this.findOne(orderDetailsId);
  }

  async getRevenueByCategory(): Promise<CategoriesRevenue[]> {
    const results = await this.orderDetailsRepository
      .createQueryBuilder('orderDetail')
      .innerJoin('orderDetail.productVariant', 'productVariant')
      .innerJoin('productVariant.product', 'product')
      .innerJoin('product.category', 'category')
      .select('category.categoryId', 'categoryId')
      .addSelect(
        'SUM(orderDetail.quantity * COALESCE(orderDetail.promotionPrice, orderDetail.price))',
        'totalRevenue',
      )
      .groupBy('category.categoryId')
      .orderBy('totalRevenue', 'DESC')
      .getRawMany();

    return results.map((result) => ({
      categoryId: result.categoryId,
      totalRevenue: parseFloat(result.totalRevenue),
    }));
  }

  async getTopSellingProducts(): Promise<TopsellingProducts[]> {
    const results = await this.orderDetailsRepository
      .createQueryBuilder('orderDetail')
      .innerJoin('orderDetail.productVariant', 'productVariant')
      .innerJoin('productVariant.product', 'product')
      .select('product.productId', 'productId')
      .addSelect('product.productName', 'productName')
      .addSelect('SUM(orderDetail.quantity)', 'totalSold')
      .groupBy('product.productId')
      .addGroupBy('product.productName')
      .orderBy('totalSold', 'DESC')
      .limit(10)
      .getRawMany();

    return results.map((result) => ({
      productId: result.productId,
      productName: result.productName,
      totalSold: parseInt(result.totalSold, 10),
    }));
  }
}
export interface TopsellingProducts {
  productId: number;
  productName: string;
  totalSold: number;
}

export interface CategoriesRevenue {
  categoryId: number;
  totalRevenue: number;
}
