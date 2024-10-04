import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariant } from '../entities/product-variant.entity';
import { ProductVariantDto } from './dto/product-variant.dto';

@Injectable()
export class ProductVariantsService {
  constructor(
    @InjectRepository(ProductVariant)
    private productVariantsRepository: Repository<ProductVariant>,
  ) {}

  create(createProductVariantDto: ProductVariantDto): Promise<ProductVariant> {
    const variant = this.productVariantsRepository.create(
      createProductVariantDto,
    );
    return this.productVariantsRepository.save(variant);
  }

  findAll(): Promise<ProductVariant[]> {
    return this.productVariantsRepository.find();
  }

  findOne(id: number): Promise<ProductVariant> {
    return this.productVariantsRepository.findOneBy({ variantId: id });
  }

  async remove(id: number): Promise<void> {
    await this.productVariantsRepository.delete(id);
  }
}
