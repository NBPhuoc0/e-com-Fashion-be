import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { ProductDto } from '../dto/product.dto';
import { ProductVariantsService } from './product-variants.service';
import { CategoriesService } from './product-categories.service';
import { S3ClientService } from 'src/common/s3-client/s3-client.service';
import { UpdateProductDto } from '../dto/update-product.dto';
import slugify from 'slugify';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private productVariantsService: ProductVariantsService,
    private categoriesService: CategoriesService,
    private s3ClientService: S3ClientService,
  ) {}

  logger = new Logger('ProductsService');

  async create(createProductDto: ProductDto) {
    const product = this.productsRepository.create(createProductDto);
    const presignedUrlForVariants = {};
    // product.productName = createProductDto.productName;
    // product.description = createProductDto.description;
    // product.price = createProductDto.price;
    product.urlSlug = slugify(createProductDto.productName);
    this.logger.log({ ...product });

    product.category = await this.categoriesService.findOne(
      createProductDto.categoryId,
    );

    product.variants = [];

    for (const variant of createProductDto.variants) {
      const newVariant = await this.productVariantsService.create(variant);
      presignedUrlForVariants[newVariant.variantId] = [];

      // for (let i = 0; i < 6; i++) {
      //   const presignedUrl = await this.s3ClientService.getPresignedSignedUrl(
      //     `${product.productId}/${newVariant.variantId}/${i}`,
      //   );
      //   presignedUrlForVariants[newVariant.variantId].push(presignedUrl.url);
      // }

      product.variants.push(newVariant);
    }

    // this.logger.log(presignedUrlForVariants);

    this.productsRepository.save(product);
    return { productId: product.productId, presignedUrlForVariants };
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
    skip: number = 20,
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
    skip: number = 20,
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
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.productsRepository.update(id, updateProductDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productsRepository.delete(id);
  }
}
