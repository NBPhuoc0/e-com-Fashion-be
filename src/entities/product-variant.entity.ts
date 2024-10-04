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
import { ProductSize } from 'src/common/enum';
import { CartItem } from './cart-item.entity';
import { OrderDetail } from './order-detail.entity';
import { ProductVariantSizeStock } from './product-variant-size-stock.entity';

@Entity()
export class ProductVariant {
  @PrimaryGeneratedColumn()
  variantId: number;

  @Column()
  colorName: string;

  @Column()
  colorHex: string;

  @Column('simple-array')
  imageUrls: string[];

  @ManyToOne(() => Product, (product) => product.variants)
  product: Product;

  @OneToOne(() => ProductVariantSizeStock, (sizeStock) => sizeStock.variant)
  @JoinColumn()
  sizeStocks: ProductVariantSizeStock;
}
