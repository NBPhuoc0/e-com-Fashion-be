import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariant } from '../../entities/product-variant.entity';
import { ProductVariantDto } from '../dto/product-variant.dto';
import { ProductVariantSizeStock } from 'src/entities/product-variant-size-stock.entity';
import { ProductSize } from 'src/common/enum';

@Injectable()
export class ProductVariantsService {
  constructor(
    @InjectRepository(ProductVariant)
    private productVariantsRepository: Repository<ProductVariant>,
    @InjectRepository(ProductVariantSizeStock)
    private productVariantSizeStockRepository: Repository<ProductVariantSizeStock>,
  ) {}

  create(createProductVariantDto: ProductVariantDto): Promise<ProductVariant> {
    const variant = this.productVariantsRepository.create();
    variant.variantColor = createProductVariantDto.variantColor;

    const sizeStock = this.productVariantSizeStockRepository.create();
    for (const size in createProductVariantDto.listSize) {
    }

    this.productVariantSizeStockRepository.save(sizeStock);
    variant.sizeStockQuantity = sizeStock;
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
