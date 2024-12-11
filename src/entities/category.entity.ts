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
export class ProductCategory {
  @PrimaryGeneratedColumn()
  categoryId: number;

  @Column()
  categoryName: string;

  @Column()
  urlSlug: string;

  @Column()
  imgUrl: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @TreeParent({ onDelete: 'SET NULL' })
  parent: ProductCategory;

  @TreeChildren({ cascade: true })
  children: ProductCategory[];

  @CreateDateColumn({
    select: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    select: false,
  })
  updatedAt: Date;
}
