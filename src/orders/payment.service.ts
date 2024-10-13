import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payment.entity';
import { Repository } from 'typeorm';
import { PaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  async create(dto: PaymentDto): Promise<Payment> {
    const payment = this.paymentsRepository.create(dto);
    return this.paymentsRepository.save(payment);
  }
}
