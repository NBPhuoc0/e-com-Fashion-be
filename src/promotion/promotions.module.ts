import { Module } from '@nestjs/common';
import { PromotionsService } from './services/promotions.service';
import { PromotionsController } from './promotions.controller';
import { Promotion } from 'src/entities/promotion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voucher } from 'src/entities/voucher.entity';
import { ProductsModule } from 'src/products/products.module';
import { VouchersService } from './services/voucher.service';

@Module({
  imports: [
    // Add the following imports
    TypeOrmModule.forFeature([Promotion, Voucher]),
    ProductsModule,
  ],
  controllers: [PromotionsController],
  providers: [PromotionsService, VouchersService],
  exports: [ProductsModule, PromotionsService, VouchersService],
})
export class PromotionsModule {}
