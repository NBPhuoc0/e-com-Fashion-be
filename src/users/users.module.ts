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

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Cart, CartItem, Review]),
    OrdersModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, ReviewsService],
  exports: [UsersService, ReviewsService, TypeOrmModule],
})
export class UsersModule {}
