import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payment.entity';
import { Repository } from 'typeorm';
import { PaymentDto } from '../dto/payment.dto';
import { ConfigService } from '@nestjs/config';
// import { PayOsService } from 'src/common/pay-os/payos.service';
import PayOS from '@payos/node';
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

  create(): Payment {
    return this.paymentsRepository.create();
  }

  async createPayOSPayment(): Promise<any> {
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

  async verifyPayOSPayment(query: any): Promise<any> {
    return this.payos.verifyPaymentWebhookData(query);
  }

  async cancelPayOSPayment(id: number): Promise<any> {
    return this.payos.cancelPaymentLink(id);
  }
}
