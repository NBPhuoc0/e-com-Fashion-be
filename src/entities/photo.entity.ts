import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { ProductVariant } from './product-variant.entity';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  photoId: number;

  @Column()
  imgUrl: string;

  @Column()
  position: number;

  @ManyToOne(() => ProductVariant, (variant) => variant.photos)
  productVariant: ProductVariant;
}
