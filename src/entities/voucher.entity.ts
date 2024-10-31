import { VoucherType } from 'src/common/interface';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
