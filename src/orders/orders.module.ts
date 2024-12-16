import { forwardRef, Module } from '@nestjs/common';
import { OrdersService } from './service/orders.service';
import { OrdersController } from './orders.controller';
import { Order } from 'src/entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetail } from 'src/entities/order-detail.entity';
import { Payment } from 'src/entities/payment.entity';
import { OrderDetailService } from './service/order-detail.service';
import { PaymentService } from './service/payment.service';
import { ProductsModule } from 'src/products/products.module';
import { PromotionsModule } from 'src/promotion/promotions.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail, Payment]),
    PromotionsModule,
    UsersModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderDetailService, PaymentService],
  exports: [
    OrdersService,
    PromotionsModule,
    OrderDetailService,
    PaymentService,
  ],
})
export class OrdersModule {}
