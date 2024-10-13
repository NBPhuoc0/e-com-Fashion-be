import { IsNumber, IsEnum, IsString, IsDate } from 'class-validator';
import { ShippingStatus } from 'src/common/enum';
import { Order } from 'src/entities/order.entity';

export class ShippingDto {
  order: Order;

  shippingStatus: ShippingStatus;

  trackingNumber: string;

  deliveryDate: Date;
}
