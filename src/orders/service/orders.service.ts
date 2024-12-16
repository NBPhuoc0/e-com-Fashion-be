import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { MoreThan, Repository } from 'typeorm';
import { OrderDetail } from 'src/entities/order-detail.entity';
import { Payment } from 'src/entities/payment.entity';
import { OrderDetailService } from './order-detail.service';
import { OrderDto } from '../dto/order.dto';
import { PaymentService } from './payment.service';
import { ProductsService } from 'src/products/service/products.service';
import { PaymentDto } from '../dto/payment.dto';
import { OrderStatus, PaymentMethod } from 'src/common/common.e';
import { VouchersService } from 'src/promotion/services/voucher.service';
import { VoucherType } from 'src/common/interface';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private orderDetailService: OrderDetailService,
    private paymentService: PaymentService,
    private vourcherService: VouchersService,
  ) {}

  private logger = new Logger('OrdersService');

  async create(dto: OrderDto): Promise<any> {
    const order = this.ordersRepository.create();
    order.user = dto.user;
    order.shippingAddress = dto.shippingAddress;

    const cartItems = order.user.carts.cartItems;

    order.orderDetails = await Promise.all(
      cartItems.map((cartItem) =>
        this.orderDetailService.create({
          productId: cartItem.productId,
          productVariant: cartItem.productVariant,
          quantity: cartItem.quantity,
          price: cartItem.price,
          promotionPrice: cartItem.promotionPrice,
        }),
      ),
    );

    order.subTotal = order.orderDetails.reduce(
      (total, orderDetail) =>
        total +
        (orderDetail.promotionPrice || orderDetail.price) *
          orderDetail.quantity,
      0,
    );

    let discount = 0;
    const voucher = await this.vourcherService.findOneByCode(dto.voucherCode);
    if (voucher && voucher.voucherStatus) {
      order.voucher = voucher;
      if (voucher.voucherType === VoucherType.PERCENTAGE) {
        discount = (order.subTotal * voucher.voucherValue) / 100;
        if (voucher.voucherMaxValue && discount > voucher.voucherMaxValue) {
          discount = voucher.voucherMaxValue;
        }
      } else {
        discount = voucher.voucherValue;
      }
    }

    order.totalPrice = order.subTotal + order.shippingFee - discount;
    let paylink = null;
    if (dto.paymentMethod === PaymentMethod.COD) {
      order.payment = this.paymentService.createCOD(
        new PaymentDto(order.totalPrice, order),
      );
    } else {
      const { payment, checkout } = await this.paymentService.createPayOS(
        new PaymentDto(order.totalPrice, order),
        order,
      );
      order.payment = payment;
      paylink = checkout;
    }
    await this.ordersRepository.save(order);

    return {
      order,
      paylink,
    };
  }

  async findAll(skip: number = 0, take: number = 24): Promise<Order[]> {
    return this.ordersRepository.find({ skip: 0, take: 10 });
  }

  async findAllByUser(userId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: {
        user: {
          userId: userId,
        },
      },
    });
  }

  async findOne(orderId: number): Promise<Order> {
    return this.ordersRepository.findOneBy({ orderId });
  }

  async cancelOrder(id: number): Promise<Order> {
    const order = await this.findOne(id);
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    if (order.orderStatus === OrderStatus.CANCELLED) {
      throw new BadRequestException('Order already cancelled');
    } else if (order.orderStatus === OrderStatus.DELIVERING) {
      throw new BadRequestException('Order is delivering');
    } else if (order.orderStatus === OrderStatus.COMPLETED) {
      throw new BadRequestException('Order already completed');
    }
    order.orderStatus = OrderStatus.CANCELLED;
    await this.ordersRepository.save(order);
    return order;
  }

  async getMonthlyRevenue(
    year: number,
    month: number,
  ): Promise<DailyRevenue[]> {
    this.logger.log(`Get monthly revenue of ${month}/${year}`);
    const query = await this.ordersRepository
      .createQueryBuilder('order')
      .select('DATE(order.orderDate)', 'date')
      .addSelect('SUM(order.totalPrice)', 'revenue')
      .where('YEAR(order.orderDate) = :year', { year })
      .andWhere('MONTH(order.orderDate) = :month', { month })
      .groupBy('DATE(order.orderDate)')
      .orderBy('DATE(order.orderDate)', 'ASC')
      .getRawMany()
      .catch((error) => {
        this.logger.error(error);
        return [];
      });

    // const query = await this.ordersRepository.find({
    //   where: {
    //     orderDate: MoreThan(new Date(year, month - 1, 0)),
    //   },
    // });

    return query.map((result) => ({
      date: result.date,
      revenue: parseFloat(result.revenue),
    }));
  }


  
}

export interface DailyRevenue {
  date: string;
  revenue: number;
}
