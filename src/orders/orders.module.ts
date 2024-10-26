import { forwardRef, Module } from '@nestjs/common';
import { OrdersService } from './service/orders.service';
import { OrdersController } from './orders.controller';
import { Order } from 'src/entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetail } from 'src/entities/order-detail.entity';
import { Shipping } from 'src/entities/shipping.entity';
import { Payment } from 'src/entities/payment.entity';
import { OrderDetailService } from './service/order-detail.service';
import { ShippingService } from './service/shipping.service';
import { PaymentService } from './service/payment.service';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail, Shipping, Payment]),
    ProductsModule,
  ],
  controllers: [],
  providers: [
    OrdersService,
    OrderDetailService,
    ShippingService,
    PaymentService,
  ],
  exports: [OrdersService, ProductsModule, TypeOrmModule],
})
export class OrdersModule {}
