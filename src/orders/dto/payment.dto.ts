import { PaymentMethod, PaymentStatus } from 'src/common/common.e';

export class PaymentDto {
  paymentMethod: PaymentMethod;
  paymentAmount: number;
  paymentReference: string;
  paymentStatus: PaymentStatus;
  paymentDate: Date;
}
