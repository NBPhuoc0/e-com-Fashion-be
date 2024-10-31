import { Module } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';
import { Promotion } from 'src/entities/promotion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voucher } from 'src/entities/voucher.entity';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    // Add the following imports
    TypeOrmModule.forFeature([Promotion, Voucher]),
    ProductsModule,
  ],
  controllers: [PromotionsController],
  providers: [PromotionsService],
  exports: [ProductsModule],
})
export class PromotionsModule {}
