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
import { OrderStatus, PaymentMethod } from 'src/common/common.e';
import { Voucher } from './voucher.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  orderId: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PROCESSING })
  orderStatus: OrderStatus;

  @Column('decimal', { default: 50000 })
  shippingFee: number;

  @Column('decimal')
  subTotal: number;

  @Column('decimal')
  totalPrice: number;

  @Column()
  shippingAddress: string;

  @CreateDateColumn()
  orderDate: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => OrderDetail, (orderDetails) => orderDetails.order, {
    cascade: true,
  })
  @JoinColumn()
  orderDetails: OrderDetail[];

  @OneToOne(() => Payment, {
    cascade: true,
  })
  @JoinColumn()
  payment: Payment;

  @ManyToOne(() => Voucher, {})
  @JoinColumn()
  voucher: Voucher;
}
