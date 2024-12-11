import { PromotionType } from 'src/common/interface';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Promotion {
  @PrimaryGeneratedColumn()
  promotionId: number;

  @Column({
    unique: true,
  })
  promotionSlug: string;

  @Column()
  promotionName: string;

  @Column()
  promotionImage: string;

  @Column()
  promotionDescription: string;

  @Column()
  promotionStartDate: Date;

  @Column()
  promotionEndDate: Date;

  @Column({ default: true })
  promotionStatus: boolean;

  @Column({
    type: 'enum',
    enum: PromotionType,
  })
  promotionType: PromotionType;

  @OneToMany(() => Product, (prd) => prd.promotion, {
    cascade: ['update'],
  })
  products: Product[];

  @Column()
  promotionValue: number; // value of the discount

  @Column({ nullable: true })
  promotionMaxValue: number; // Maximum discount amount for percentage-based discounts
}
