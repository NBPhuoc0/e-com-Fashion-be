import { IsNumber, IsEnum, IsString, IsDate } from 'class-validator';
import { ShippingStatus } from 'src/common/common.e';
import { Order } from 'src/entities/order.entity';

export class ShippingDto {
  order: Order;

  shippingStatus: ShippingStatus;

  trackingNumber: string;

  deliveryDate: Date;
}
