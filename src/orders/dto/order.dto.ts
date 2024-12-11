import {
  IsEnum,
  IsNumber,
  IsString,
  IsDate,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus, PaymentMethod } from 'src/common/common.e';
import { OrderDetailDto } from './order-detail.dto';
import { PaymentDto } from './payment.dto';
import { ShippingDto } from './shipping.dto';
import { User } from 'src/entities/user.entity';

export class OrderDto {
  @IsString()
  shippingAddress: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderDetailDto)
  orderDetails: OrderDetailDto[];

  user: User;
}
