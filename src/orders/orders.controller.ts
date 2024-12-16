import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrdersService } from './service/orders.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './service/payment.service';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from 'src/common/interface';
import { OrderDto } from './dto/order.dto';
import { UsersService } from 'src/users/service/users.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('orders')
@ApiTags('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly userService: UsersService,
    private readonly paymentService: PaymentService,
  ) {}

  @Post()
  async create(@Req() req: RequestWithUser, @Body() body: OrderDto) {
    const user = await this.userService.findOneUser(req.user.userId);
    body.user = user;
    return this.paymentService.createPayOSPaymentTest();
  }

  @Get('cancel/:id')
  async cancelOrder(@Param('id') id: string) {
    return this.ordersService.cancelOrder(+id);
  }

  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.ordersService.findAllByUser(req.user.userId);
  }
}
