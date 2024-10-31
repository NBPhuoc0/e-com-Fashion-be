import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Photo } from './photo.entity';
import { ProductVariantSizeStock } from './product-variant-size-stock.entity';

@Entity()
export class ProductVariant {
  @PrimaryGeneratedColumn()
  variantId: number;

  @Column()
  variantColor: string;

  @Column()
  variantHex: string;

  @OneToOne(() => ProductVariantSizeStock, (ss) => ss.variantId, {
    cascade: true,
  })
  @JoinColumn({})
  sizeStockQuantity: ProductVariantSizeStock;

  @ManyToOne(() => Product, (product) => product.variants)
  product: Product;

  @OneToMany(() => Photo, (photo) => photo.productVariant, { cascade: true })
  photos: Photo[];
}
