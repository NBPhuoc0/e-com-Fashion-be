import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  TreeParent,
  TreeChildren,
  Tree,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
@Tree('nested-set')
export class Category {
  @PrimaryGeneratedColumn()
  categoryId: number;

  @Column()
  categoryName: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @TreeParent()
  parent: Category;

  @TreeChildren()
  children: Category[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
