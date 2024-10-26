import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { Repository } from 'typeorm';
import { OrderDetail } from 'src/entities/order-detail.entity';
import { Payment } from 'src/entities/payment.entity';
import { Shipping } from 'src/entities/shipping.entity';
import { OrderDetailService } from './order-detail.service';
import { OrderDto } from '../dto/order.dto';
import { ShippingService } from './shipping.service';
import { PaymentService } from './payment.service';
import { ProductsService } from 'src/products/service/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private orderDetailService: OrderDetailService,
    private shippingService: ShippingService,
    private paymentService: PaymentService,
    private productService: ProductsService,
  ) {}

  async create(dto: OrderDto): Promise<Order> {
    const order = this.ordersRepository.create();

    order.user = dto.user;

    order.shippingAddress = dto.shippingAddress;
    order.paymentMethod = dto.paymentMethod;

    order.orderDetails = await Promise.all(
      dto.orderDetails.map((detail) => this.orderDetailService.create(detail)),
    );

    return this.ordersRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find();
  }
}
