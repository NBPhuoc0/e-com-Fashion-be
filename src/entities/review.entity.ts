import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { User } from './user.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  reviewId: number;

  @ManyToOne(() => Product, (product) => product.reviews, { cascade: true })
  product: Product;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;

  @Column()
  rating: number;

  @Column()
  comment: string;

  @CreateDateColumn()
  createdAt: Date;
}
