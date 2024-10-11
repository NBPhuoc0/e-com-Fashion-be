import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Review } from './review.entity';
import { Cart } from './cart.entity';
import { Role } from 'src/common/enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  fullName: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Review, (review) => review.user, { cascade: true })
  reviews: Review[];

  @OneToOne(() => Cart, (cart) => cart.user, { cascade: true })
  @JoinColumn()
  carts: Cart;
}
