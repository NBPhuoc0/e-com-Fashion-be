import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,

    private dataSource: DataSource,
  ) {}

  async create(createCategoryDto: CategoryDto): Promise<Category> {
    const category = this.categoriesRepository.create();
    category.categoryName = createCategoryDto.categoryName;
    if (createCategoryDto.parent) {
      category.parent = await this.findOne(createCategoryDto.parent);
    }
    return this.categoriesRepository.save(category);
  }

  findAll(): Promise<Category[]> {
    // return this.categoriesRepository.find({
    //   relations: ['parent', 'children'],
    // });
    return this.dataSource.getTreeRepository(Category).findTrees();
  }

  findOne(id: number): Promise<Category> {
    return this.categoriesRepository.findOneBy({ categoryId: id });
  }

  async update(
    id: number,
    updateCategoryDto: Partial<CategoryDto>,
  ): Promise<Category> {
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
