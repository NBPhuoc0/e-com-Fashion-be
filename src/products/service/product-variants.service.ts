import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariant } from '../../entities/product-variant.entity';
import { ProductVariantDto } from '../dto/product-variant.dto';
import { ProductVariantSizeStock } from 'src/entities/product-variant-size-stock.entity';
import { ProductSize } from 'src/common/common.e';
import { log } from 'console';
import { Photo } from 'src/entities/photo.entity';
import { PhotoDto } from '../dto/photo.dto';

@Injectable()
export class ProductVariantsService {
  constructor(
    @InjectRepository(ProductVariant)
    private productVariantsRepository: Repository<ProductVariant>,
    @InjectRepository(ProductVariantSizeStock)
    private productVariantSizeStockRepository: Repository<ProductVariantSizeStock>,
  ) {}
  logger = new Logger('ProductVariantsService');

  create(createProductVariantDto: ProductVariantDto): ProductVariant {
    const variant = this.productVariantsRepository.create(
      createProductVariantDto,
    );
    // this.logger.log({ variant });
    // variant.variantColor = createProductVariantDto.variantColor;
    const sizeStock = this.productVariantSizeStockRepository.create();
    for (const size in createProductVariantDto.listSize) {
      switch (size) {
        case '0':
          sizeStock.s = createProductVariantDto.listSize[size];
          break;
        case '1':
          sizeStock.m = createProductVariantDto.listSize[size];
          break;
        case '2':
          sizeStock.l = createProductVariantDto.listSize[size];
          break;
        case '3':
          sizeStock.xl = createProductVariantDto.listSize[size];
          break;
        case '4':
          sizeStock.xxl = createProductVariantDto.listSize[size];
          break;
        default:
          break;
      }
    }

    variant.sizeStockQuantity = sizeStock;

    return variant;
    // return this.productVariantsRepository.save(variant);
  }

  async saveProductVariant(variant: ProductVariant): Promise<ProductVariant> {
    return await this.productVariantsRepository.save(variant);
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
