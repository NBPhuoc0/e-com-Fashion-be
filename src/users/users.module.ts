import { Module } from '@nestjs/common';
import { UsersService } from './service/users.service';
import { UsersController } from './users.controller';
import { User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/entities/cart.entity';
import { CartItem } from 'src/entities/cart-item.entity';
import { Review } from 'src/entities/review.entity';
import { ReviewsService } from './service/reviews.service';
import { OrdersModule } from 'src/orders/orders.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Cart, CartItem, Review]),
    ProductsModule,
    // OrdersModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, ReviewsService],
  exports: [UsersService, ReviewsService],
})
export class UsersModule {}
