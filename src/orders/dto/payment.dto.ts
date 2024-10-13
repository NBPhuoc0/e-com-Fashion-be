import { IsNumber, IsString, IsDate } from 'class-validator';
import { Order } from 'src/entities/order.entity';

export class PaymentDto {
  order: Order;
  paymentMethod: string;
  paymentStatus: string;
  paymentDate: Date;
}
