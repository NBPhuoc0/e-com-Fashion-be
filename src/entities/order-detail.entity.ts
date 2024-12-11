import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { ProductVariant } from './product-variant.entity';

@Entity()
export class OrderDetail {
  @PrimaryGeneratedColumn()
  orderDetailsId: number;

  @ManyToOne(() => Order, (order) => order.orderDetails)
  order: Order;

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
