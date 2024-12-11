import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { Repository } from 'typeorm';
import { OrderDetail } from 'src/entities/order-detail.entity';
import { Payment } from 'src/entities/payment.entity';
import { OrderDetailService } from './order-detail.service';
import { OrderDto } from '../dto/order.dto';
import { PaymentService } from './payment.service';
import { ProductsService } from 'src/products/service/products.service';
import { PaymentDto } from '../dto/payment.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private orderDetailService: OrderDetailService,
    private paymentService: PaymentService,
    private productService: ProductsService,
  ) {}

  async create(dto: OrderDto): Promise<Order> {
    const order = this.ordersRepository.create();
    const payment = this.paymentService.create();
    order.user = dto.user;
    order.shippingAddress = dto.shippingAddress;

    order.payment = payment;

    order.orderDetails = await Promise.all(
      dto.orderDetails.map((detail) => this.orderDetailService.create(detail)),
    );

    return this.ordersRepository.save(order);
  }

  async findAll(skip: number = 0, take: number = 24): Promise<Order[]> {
    return this.ordersRepository.find({ skip: 0, take: 10 });
  }
}
