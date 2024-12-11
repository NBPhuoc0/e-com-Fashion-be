import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { ProductCategory } from './category.entity';
import { Review } from './review.entity';
import { ProductVariant } from './product-variant.entity';
import { Promotion } from './promotion.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  productId: number;

  @Column()
  productName: string;

  @Column({
    unique: true,
    nullable: true,
  })
  urlSlug: string;

  @Column()
  description: string;

  @Column({
    default: 0,
  })
  sold: number;

  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: true,
  })
  variants: ProductVariant[];

  @ManyToOne(() => ProductCategory, (category) => category.products)
  category: ProductCategory;

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @Column('decimal')
  price: number;

  @Column({
    nullable: true,
    type: 'decimal',
  })
  promotionPrice: number;

  @ManyToOne(() => Promotion, (promotion) => promotion.products)
  promotion: Promotion;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
