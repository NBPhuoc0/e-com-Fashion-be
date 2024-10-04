import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Review } from './review.entity';
import { OrderDetails } from './order-details.entity';
import { CartItem } from './cart-item.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  productId: number;

  @Column()
  productName: string;

  @Column()
  description: string;

  @Column('decimal')
  price: number;

  @Column()
  stockQuantity: number;

  @Column()
  imageUrl: string;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @OneToMany(() => OrderDetails, (orderDetails) => orderDetails.product)
  orderDetails: OrderDetails[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
