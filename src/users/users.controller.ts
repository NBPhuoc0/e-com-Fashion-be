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
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './service/users.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/common/interface';
import { ReviewDto } from './dto/review.dto';
import { ReviewsService } from './service/reviews.service';
import { ProductsService } from 'src/products/service/products.service';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartItemDto } from './dto/cart-item.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
    private readonly reviewService: ReviewsService,
  ) {}

  @Get('profile')
  async getUserProfile(@Req() req: RequestWithUser) {
    return this.usersService.findOneUser(req.user.userId);
  }

  @Post('review/:productId')
  async createReview(
    @Req() req: RequestWithUser,
    @Param('productId') productId: number,
    @Body() reviewdto: ReviewDto,
  ) {
    const product = await this.productsService.findOneProd(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const user = await this.usersService.findOneUser(req.user.userId);
    reviewdto.product = product;
    reviewdto.user = user;
    const review = this.reviewService.create(reviewdto);
    user.reviews.push(review);
    return this.usersService.updateUser(user);
  }

  @Patch('update/cart')
  async updateCart(@Req() req: RequestWithUser, @Body() cart: CartItemDto) {
    const user = await this.usersService.findOneUser(req.user.userId);
    const variant = await this.productsService.findVariantByIdWithProd(
      cart.productVariantId,
    );
    if (!variant) {
      throw new NotFoundException('Product variant not found');
    }
    return await this.usersService.updateCart(user, variant, cart.quantity);
  }

  @Get('cart')
  async getCart(@Req() req: RequestWithUser) {
    const user = await this.usersService.findOneUser(req.user.userId);
    return user.carts;
  }
}
