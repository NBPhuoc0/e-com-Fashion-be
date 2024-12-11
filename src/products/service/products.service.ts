import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { ProductDto } from '../dto/product.dto';
import { ProductVariantsService } from './product-variants.service';
import { CategoriesService } from './product-categories.service';
import { UpdateProductDto } from '../dto/update-product.dto';
import slugify from 'slugify';
import { PhotoDto } from '../dto/photo.dto';
import { Promotion } from 'src/entities/promotion.entity';
import { ProductVariant } from 'src/entities/product-variant.entity';
import { Photo } from 'src/entities/photo.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
    private productVariantsService: ProductVariantsService,
    private categoriesService: CategoriesService,
  ) {}

  logger = new Logger('ProductsService');

  async create(createProductDto: ProductDto) {
    const product = this.productsRepository.create(createProductDto);
    // const presignedUrlForVariants = {};
    // product.productName = createProductDto.productName;
    // product.description = createProductDto.description;
    // product.price = createProductDto.price;
    // return product;
    // this.logger.log({ ...product });

    product.category = await this.categoriesService.findOne(
      createProductDto.categoryId,
    );

    // product.variants = [];

    for (const i in product.variants) {
      // this.logger.log({ ...product.variants[variant] });
      const newVariant = this.productVariantsService.create(
        createProductDto.variants[i],
      );
      // presignedUrlForVariants[newVariant.variantId] = [];
      // for (let i = 0; i < 6; i++) {
      //   const presignedUrl = await this.s3ClientService.getPresignedSignedUrl(
      //     `${product.urlSlug}/${newVariant.variantId}/${i}`,
      //   );
      //   presignedUrlForVariants[newVariant.variantId].push(presignedUrl.url);
      // }
      product.variants[i] = newVariant;
    }

    // this.logger.log({ ...presignedUrlForVariants, ...product });

    await this.productsRepository.save(product);

    product.urlSlug =
      slugify(createProductDto.productName) + '-' + product.productId;

    // return { productId: product.productId, presignedUrlForVariants };
    return await this.productsRepository.save(product);
  }

  createPhoto(createPhotoDto: PhotoDto): Photo {
    return this.photoRepository.create(createPhotoDto);
  }

  async updatePhotoVariant(variant: ProductVariant, imgUrls: string[]) {
    variant.photos = [];
    variant.photos = imgUrls.map((url, i): Photo => {
      return this.createPhoto({ imgUrl: url, position: i });
    });
    return await this.productVariantsService.saveProductVariant(variant);
  }

  findAll(page: number = 0, skip: number = 24): Promise<Product[]> {
    const take = skip;
    const offset = page * skip;
    return this.productsRepository.find({
      relations: [
        'variants',
        'variants.sizeStockQuantity',
        'category.parent',
        'promotion',
      ],
      skip: offset,
      take,
    });
  }

  findOneProd(id: number): Promise<Product> {
    return this.productsRepository.findOneBy({ productId: id });
  }

  findProdsByIds(ids: number[]): Promise<Product[]> {
    return this.productsRepository.findBy({ productId: In(ids) });
  }

  findProdBySlug(slug: string): Promise<Product> {
    return this.productsRepository.findOneBy({ urlSlug: slug });
  }

  findVariantById(variantId: number): Promise<ProductVariant> {
    return this.productVariantsService.findOne(variantId);
  }

  updateVariant(variant: ProductVariant) {
    return this.productVariantsService.saveProductVariant(variant);
  }

  async findByCategoryId(
    categoryId: number,
    page: number = 0,
    skip: number = 24,
    priceOption?: number,
    order?: string,
  ): Promise<Product[]> {
    const take = skip;
    const offset = page * skip;
    let minPrice = 0;
    let maxPrice = 10000000;
    order = order || 'ASC';
    switch (priceOption) {
      case 1:
        maxPrice = 150000;
        break;
      case 2:
        minPrice = 150000;
        maxPrice = 300000;
        break;
      case 3:
        minPrice = 300000;
        break;
    }
    return this.productsRepository.find({
      where: { category: { categoryId }, price: Between(minPrice, maxPrice) },
      relations: [
        'variants',
        'variants.sizeStockQuantity',
        'category.parent',
        'promotion',
      ],
      skip: offset,
      order: order === 'ASC' ? { price: 'ASC' } : { price: 'DESC' },
      take: take,
    });
  }

  async findByProductName(
    productName: string,
    page: number = 0,
    skip: number = 24,
    priceOption?: number,
    order?: string,
  ): Promise<Product[]> {
    const take = skip;
    const offset = page * skip;
    let minPrice = 0;
    let maxPrice = 10000000;
    order = order || 'ASC';
    switch (priceOption) {
      case 1:
        maxPrice = 150000;
        break;
      case 2:
        minPrice = 150000;
        maxPrice = 300000;
        break;
      case 3:
        minPrice = 300000;
        break;
    }
    return this.productsRepository.find({
      where: { productName: productName, price: Between(minPrice, maxPrice) },
      relations: [
        'variants',
        'variants.sizeStockQuantity',
        'category.parent',
        'promotion',
      ],
      skip: offset,
      take: take,
      order: order === 'ASC' ? { price: 'ASC' } : { price: 'DESC' },
    });
  }

  async findByPromotionId(
    promotionId: number,
    page: number = 0,
    skip: number = 24,
    priceOption?: number,
    order?: string,
  ): Promise<Product[]> {
    const take = skip;
    const offset = page * skip;
    let minPrice = 0;
    let maxPrice = 10000000;
    order = order || 'ASC';
    switch (priceOption) {
      case 1:
        maxPrice = 150000;
        break;
      case 2:
        minPrice = 150000;
        maxPrice = 300000;
        break;
      case 3:
        minPrice = 300000;
        break;
    }
    return this.productsRepository.find({
      where: { promotion: { promotionId } },
      relations: [
        'variants',
        'variants.sizeStockQuantity',
        'category.parent',
        'promotion',
      ],
      skip: offset,
      take: take,
    });
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.productsRepository.update(id, updateProductDto);
    return this.findOneProd(id);
  }

  async remove(id: number): Promise<void> {
    await this.productsRepository.delete(id);
  }

  async removePromotionFromProduct(promotion: Promotion): Promise<void> {
    await this.productsRepository.update(
      { promotion: promotion },
      { promotion: null },
    );
  }
}
