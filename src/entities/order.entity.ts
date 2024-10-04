import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { OrderDetails } from './order-details.entity';
import { Payment } from './payment.entity';
import { Shipping } from './shipping.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  orderId: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column()
  orderStatus: string;

  @Column('decimal')
  totalPrice: number;

  @Column()
  shippingAddress: string;

  @Column()
  paymentMethod: string;

  @CreateDateColumn()
  orderDate: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => OrderDetails, (orderDetails) => orderDetails.order)
  orderDetails: OrderDetails[];

  @OneToOne(() => Payment, (payment) => payment.order)
  payment: Payment;

  @OneToOne(() => Shipping, (shipping) => shipping.order)
  shipping: Shipping;
}
