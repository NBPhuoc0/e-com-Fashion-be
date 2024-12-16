import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payment.entity';
import { Repository } from 'typeorm';
import { PaymentDto } from '../dto/payment.dto';
import { ConfigService } from '@nestjs/config';
// import { PayOsService } from 'src/common/pay-os/payos.service';
import PayOS from '@payos/node';
import {
  CheckoutRequestType,
  CheckoutResponseDataType,
  PaymentLinkDataType,
  WebhookDataType,
} from 'src/common/type';
import { Order } from 'src/entities/order.entity';
import { PaymentMethod, PaymentStatus } from 'src/common/common.e';
// const PayOS = require('@payos/node');

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    private configService: ConfigService,
  ) {}
  // private payos = new PayOS(
  //   this.configService.get<string>('PAYOS_CLIENT_ID'),
  //   this.configService.get<string>('PAYOS_API_KEY'),
  //   this.configService.get<string>('PAYOS_CHECKSUM_KEY'),
  // );
  private payos = new PayOS(
    process.env.PAYOS_CLIENT_ID,
    process.env.PAYOS_API_KEY,
    process.env.PAYOS_CHECKSUM_KEY,
  );

  createCOD(dto: PaymentDto): Payment {
    const payment = this.paymentsRepository.create();
    payment.paymentMethod = PaymentMethod.COD;
    payment.paymentAmount = dto.paymentAmount;
    payment.paymentStatus = PaymentStatus.COMPLETED;
    return payment;
  }

  async createPayOS(
    dto: PaymentDto,
    order: Order,
  ): Promise<{ payment: Payment; checkout: CheckoutResponseDataType }> {
    const payment = this.paymentsRepository.create();
    payment.paymentMethod = PaymentMethod.BANKING;
    payment.paymentAmount = order.totalPrice;
    payment.paymentStatus = PaymentStatus.PENDING;
    const checkout = await this.createPayOSPayment(order);
    return { payment, checkout };
  }

  async createPayOSPaymentTest(): Promise<CheckoutResponseDataType> {
    const body = {
      orderCode: Number(String(Date.now()).slice(-6)),
      amount: 2000,
      description: 'Thanh toan don hang',
      items: [
        {
          name: 'Mì tôm Hảo Hảo ly',
          quantity: 1,
          price: 10000,
        },
      ],
      returnUrl: `https://github.com/antvis/data-set/issues/93`,
      cancelUrl: `https://github.com`,
    };

    return this.payos.createPaymentLink(body);
  }

  async createPayOSPayment(order: Order): Promise<CheckoutResponseDataType> {
    const body = {
      orderCode: Number(String(Date.now()).slice(-6)),
      // amount: order.totalPrice,
      amount: 1000, //! test
      description: 'Thanh toan don hang ' + order.orderId,
      items: order.orderDetails.map((orderDetail) => ({
        name: orderDetail.productName,
        quantity: orderDetail.quantity,
        price: orderDetail.promotionPrice || orderDetail.price,
      })),
      returnUrl: `https://github.com/antvis/data-set/issues/93`,
      cancelUrl: `https://github.com`,
    };
    return this.payos.createPaymentLink(body);
  }

  async verifyPayOSPayment(query: any): Promise<WebhookDataType> {
    return this.payos.verifyPaymentWebhookData(query);
  }

  async cancelPayOSPayment(id: number): Promise<PaymentLinkDataType> {
    return this.payos.cancelPaymentLink(id);
  }
}
