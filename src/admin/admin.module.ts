import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersModule } from 'src/users/users.module';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [UsersModule, OrdersModule],
  controllers: [AdminController],
  providers: [],
})
export class AdminModule {}
