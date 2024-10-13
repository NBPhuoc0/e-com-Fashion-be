import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Shipping } from 'src/entities/shipping.entity';
import { Repository } from 'typeorm';
import { ShippingDto } from './dto/shipping.dto';

@Injectable()
export class ShippingService {
  constructor(
    @InjectRepository(Shipping)
    private shippingRepository: Repository<Shipping>,
  ) {}

  async create(dto: ShippingDto): Promise<Shipping> {
    const shipping = this.shippingRepository.create(dto);
    return this.shippingRepository.save(shipping);
  }
}
