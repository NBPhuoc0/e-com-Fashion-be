import { VoucherType } from 'src/common/interface';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class Voucher {
  @PrimaryGeneratedColumn()
  voucherId: number;

  @Column({
    unique: true,
  })
  voucherCode: string;

  @Column()
  voucherName: string;

  @Column()
  voucherDescription: string;

  @Column()
  voucherStartDate: Date;

  @Column()
  voucherEndDate: Date;

  @Column()
  usageLimit: number;

  @Column({ default: 0 })
  usageCount: number;

  @Column({ default: true })
  voucherStatus: boolean;

  @Column({
    type: 'enum',
    enum: VoucherType,
  })
  voucherType: VoucherType;

  @Column()
  voucherValue: number; // value of the discount

  @Column({ nullable: true })
  voucherMaxValue: number; // Maximum discount amount for percentage-based discounts
}
