import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Voucher } from 'src/entities/voucher.entity';
import { Repository } from 'typeorm';
import { VoucherDto } from '../dto/voucher.dto';

@Injectable()
export class VouchersService {
  constructor(
    @InjectRepository(Voucher)
    private voucherRepository: Repository<Voucher>,
  ) {}

  async create(voucher: VoucherDto): Promise<Voucher> {
    if (!voucher.voucherCode) {
      voucher.voucherCode = voucher.voucherName.toLowerCase().replace(' ', '-');
    }
    return this.voucherRepository.save(voucher);
  }

  async findAll(): Promise<Voucher[]> {
    return this.voucherRepository.find();
  }

  async findOne(voucherId: number): Promise<Voucher> {
    return this.voucherRepository.findOneBy({ voucherId });
  }

  async updateVoucherStatus(voucherId: number): Promise<Voucher> {
    const voucher = await this.voucherRepository.findOneBy({ voucherId });
    voucher.voucherStatus = !voucher.voucherStatus;
    return this.voucherRepository.save(voucher);
  }

  async delete(voucherId: number): Promise<void> {
    const voucher = await this.findOne(voucherId);
    await this.voucherRepository.remove(voucher);
  }
}
