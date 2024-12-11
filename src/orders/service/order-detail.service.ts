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
}
