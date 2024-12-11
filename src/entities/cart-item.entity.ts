import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { ProductVariant } from './product-variant.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  cartItemId: number;

  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  cart: Cart;

  @ManyToOne(() => ProductVariant, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  productVariant: ProductVariant;

  @Column()
  productId: number;

  @Column('decimal')
  price: number;

  @Column('decimal')
  promotionPrice: number;

  @Column()
  quantity: number;
}
