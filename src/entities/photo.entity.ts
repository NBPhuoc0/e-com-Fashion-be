import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { ProductVariant } from './product-variant.entity';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imgUrl: string;

  @ManyToOne(() => ProductVariant, (variant) => variant.photos)
  productVariant: ProductVariant;
}
