import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { ShippingStatus } from 'src/common/enum';

@Entity()
export class Shipping {
  @PrimaryGeneratedColumn()
  shippingId: number;

  @OneToOne(() => Order, (order) => order.shipping)
  @JoinColumn()
  order: Order;

  @Column({
    type: 'enum',
    enum: ShippingStatus,
    default: ShippingStatus.PENDING,
  })
  shippingStatus: ShippingStatus;

  @Column()
  trackingNumber: string;

  @CreateDateColumn()
  deliveryDate: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
