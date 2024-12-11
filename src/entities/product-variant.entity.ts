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

  @OneToOne(() => ProductVariantSizeStock, {
    cascade: true,
  })
  @JoinColumn({})
  sizeStockQuantity: ProductVariantSizeStock;

  @ManyToOne(() => Product, (product) => product.variants, {
    createForeignKeyConstraints: false,
  })
  product: Product;

  @OneToMany(() => Photo, (photo) => photo.productVariant, { cascade: true })
  photos: Photo[];
}
