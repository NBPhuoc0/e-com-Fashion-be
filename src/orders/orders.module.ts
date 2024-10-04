import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from 'src/entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetail } from 'src/entities/order-detail.entity';
import { Shipping } from 'src/entities/shipping.entity';
import { Payment } from 'src/entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderDetail, Shipping, Payment])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
