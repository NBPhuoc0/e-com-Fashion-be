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

  @Column({ type: 'enum', enum: ShippingStatus })
  shippingStatus: ShippingStatus;

  @Column()
  trackingNumber: string;

  @CreateDateColumn()
  shippedDate: Date;

  @UpdateDateColumn()
  deliveryDate: Date;
}
