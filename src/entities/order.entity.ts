import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { OrderDetail } from './order-detail.entity';
import { Payment } from './payment.entity';
import { Shipping } from './shipping.entity';
import { OrderStatus, PaymentMethod } from 'src/common/enum';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  orderId: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  orderStatus: OrderStatus;

  @Column('decimal')
  totalPrice: number;

  @Column()
  shippingAddress: string;

  @Column({ type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @CreateDateColumn()
  orderDate: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => OrderDetail, (orderDetails) => orderDetails.order, {
    cascade: true,
  })
  @JoinColumn()
  orderDetails: OrderDetail[];

  @OneToOne(() => Payment, (payment) => payment.order, { cascade: true })
  @JoinColumn()
  payment: Payment;

  @OneToOne(() => Shipping, (shipping) => shipping.order, { cascade: true })
  @JoinColumn()
  shipping: Shipping;
}
