import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductCategory } from './category.entity';
import { Review } from './review.entity';
import { ProductVariant } from './product-variant.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  productId: number;

  @Column()
  productName: string;

  @Column()
  urlSlug: string;

  @Column()
  description: string;

  @Column('decimal')
  price: number;

  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: true,
  })
  variants: ProductVariant[];

  @ManyToOne(() => ProductCategory, (category) => category.products)
  category: ProductCategory;

  @OneToMany(() => Review, (review) => review.product, { cascade: true })
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
