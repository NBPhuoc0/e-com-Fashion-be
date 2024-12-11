import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './service/orders.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './service/payment.service';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('orders')
@ApiTags('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly paymentService: PaymentService,
  ) {}

  @Post()
  create(@Body() createOrderDto: any) {
    return this.ordersService.create(createOrderDto);
  }

  @Get('pay')
  pay() {
    return this.paymentService.createPayOSPayment();
  }

  @Get('cancel/:id')
  cancel(@Param('id') id: string) {
    return this.paymentService.cancelPayOSPayment(Number(id));
  }
}
