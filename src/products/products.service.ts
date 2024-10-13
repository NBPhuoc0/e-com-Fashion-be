import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { ProductDto } from './dto/product.dto';
import { ProductVariantsService } from './product-variant.service';
import { CategoriesService } from './categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private productVariantsService: ProductVariantsService,
    private categoriesService: CategoriesService,
  ) {}

  async create(createProductDto: ProductDto): Promise<Product> {
    const product = this.productsRepository.create();
    product.productName = createProductDto.productName;
    product.description = createProductDto.description;
    product.price = createProductDto.price;
    product.category = await this.categoriesService.findOne(
      createProductDto.categoryId,
    );

    for (const variant of createProductDto.variants) {
      const newVariant = await this.productVariantsService.create(variant);
      product.variants.push(newVariant);
    }

    return this.productsRepository.save(product);
  }

  findAll(page: number = 0, skip: number = 10): Promise<Product[]> {
    const take = skip;
    const offset = page * skip;
    return this.productsRepository.find({
      relations: ['variants', 'category'],
      skip: offset,
      take,
    });
  }

  findOne(id: number): Promise<Product> {
    return this.productsRepository.findOneBy({ productId: id });
  }

  async findByCategoryId(
    categoryId: number,
    page: number = 0,
    skip: number = 10,
  ): Promise<Product[]> {
    const take = skip;
    const offset = page * skip;
    return this.productsRepository.find({
      where: { category: { categoryId } },
      skip: offset,
      take,
    });
  }

  async findByProductName(
    productName: string,
    page: number = 0,
    skip: number = 10,
  ): Promise<Product[]> {
    const take = skip;
    const offset = page * skip;
    return this.productsRepository.find({
      where: { productName },
      skip: offset,
      take,
    });
  }

  async update(
    id: number,
    updateProductDto: Partial<ProductDto>,
  ): Promise<Product> {
    await this.productsRepository.update(id, updateProductDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productsRepository.delete(id);
  }
}
