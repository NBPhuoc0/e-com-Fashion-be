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
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
@Tree('materialized-path')
export class Category {
  @PrimaryGeneratedColumn()
  categoryId: number;

  @Column()
  categoryName: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @TreeParent({ onDelete: 'SET NULL' })
  parent: Category;

  @TreeChildren({ cascade: true })
  children: Category[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
