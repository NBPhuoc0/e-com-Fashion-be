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
import { ProductSize } from 'src/common/enum';

@Entity()
export class ProductVariant {
  @PrimaryGeneratedColumn()
  variantId: number;

  @Column()
  colorName: string;

  @Column({ type: 'enum', enum: ProductSize })
  size: ProductSize;

  @Column()
  stockQuantity: number;

  @ManyToOne(() => Product, (product) => product.variants)
  product: Product;

  @OneToMany(() => Photo, (photo) => photo.productVariant, { cascade: true })
  photos: Photo[];
}
