import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetail } from 'src/entities/order-detail.entity';
import { Repository } from 'typeorm';
import { OrderDetailDto } from './dto/order-detail.dto';

@Injectable()
export class OrderDetailService {
  constructor(
    @InjectRepository(OrderDetail)
    private orderDetailsRepository: Repository<OrderDetail>,
  ) {}

  async create(dto: OrderDetailDto): Promise<OrderDetail> {
    const orderDetail = this.orderDetailsRepository.create(dto);
    return this.orderDetailsRepository.save(orderDetail);
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
