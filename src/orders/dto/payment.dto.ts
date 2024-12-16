import { PaymentMethod, PaymentStatus } from 'src/common/common.e';
import { Order } from 'src/entities/order.entity';

export class PaymentDto {
  constructor(paymentAmount?: number, order?: Order) {
    this.paymentAmount = paymentAmount ? paymentAmount : 0;
    this.order = order ? order : null;
  }
  paymentAmount: number;
  order: Order;
}
