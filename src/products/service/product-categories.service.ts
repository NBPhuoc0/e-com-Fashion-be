import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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
    category.urlSlug = slugify(createCategoryDto.categoryName);

    if (createCategoryDto.parent) {
      category.parent = await this.findOne(createCategoryDto.parent);
    }

    return this.categoriesRepository.save(category);
  }

  findAll(): Promise<ProductCategory[]> {
    return this.dataSource.getTreeRepository(ProductCategory).findTrees();
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
}
