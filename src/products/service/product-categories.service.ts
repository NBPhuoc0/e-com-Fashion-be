import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ProductCategory } from '../../entities/category.entity';
import { CategoryDto } from '../dto/category.dto';
import { log } from 'console';
import slugify from 'slugify';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(ProductCategory)
    private categoriesRepository: Repository<ProductCategory>,

    private dataSource: DataSource,
  ) {}
  logger = new Logger('CategoriesService');

  async create(createCategoryDto: CategoryDto): Promise<ProductCategory> {
    const category = this.categoriesRepository.create();
    category.categoryName = createCategoryDto.categoryName;
    const slug = slugify(createCategoryDto.categoryName, { lower: true });
    if (await this.categoriesRepository.existsBy({ urlSlug: slug })) {
      throw new BadRequestException('Category already exists');
    }
    category.urlSlug = slug;
    if (createCategoryDto.parent) {
      category.parent = await this.findOne(createCategoryDto.parent);
    }

    return this.categoriesRepository.save(category);
  }

  findTree(): Promise<ProductCategory[]> {
    return this.dataSource.getTreeRepository(ProductCategory).findTrees();
  }

  findAll(): Promise<ProductCategory[]> {
    return this.categoriesRepository.find();
  }

  async findAncestors(id: number): Promise<number[]> {
    const category = await this.findOne(id);
    const ansestors = await this.dataSource
      .getTreeRepository(ProductCategory)
      .findAncestors(category);
    return ansestors.map((c) => c.categoryId);
  }

  async findDescendants(id: number): Promise<number[]> {
    const category = await this.findOne(id);
    const descendants = await this.dataSource
      .getTreeRepository(ProductCategory)
      .findDescendants(category);
    return descendants.map((c) => c.categoryId);
  }

  findOne(id: number): Promise<ProductCategory> {
    return this.categoriesRepository.findOneBy({ categoryId: id });
  }

  async getParent(id: number): Promise<ProductCategory[]> {
    const category = await this.findOne(id);
    this.logger.log({ id, ...category });
    return this.dataSource
      .getTreeRepository(ProductCategory)
      .findAncestors(category);
  }
  async update(
    id: number,
    updateCategoryDto: Partial<CategoryDto>,
  ): Promise<ProductCategory> {
    const category = await this.findOne(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    category.categoryName = updateCategoryDto.categoryName;
    if (updateCategoryDto.parent) {
      category.parent = await this.findOne(updateCategoryDto.parent);
    }
    return this.categoriesRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    await this.categoriesRepository.delete(id);
  }

  async updateCateImg(id: number, imgUrl: string): Promise<void> {
    await this.categoriesRepository.update(id, { imgUrl });
  }
}
