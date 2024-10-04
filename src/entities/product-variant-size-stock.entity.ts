import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { ProductVariant } from './product-variant.entity';

@Entity()
export class ProductVariantSizeStock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  s: number;

  @Column()
  m: number;

  @Column()
  l: number;

  @Column()
  xl: number;

  @Column()
  xxl: number;

  @OneToOne(() => ProductVariant, (variant) => variant.sizeStocks)
  variant: ProductVariant;
}
