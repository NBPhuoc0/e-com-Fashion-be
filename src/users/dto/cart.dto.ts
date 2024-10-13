import { User } from 'src/entities/user.entity';
import { CartItemDto } from './cart-item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CartDto {
  @ApiProperty({
    type: [CartItemDto],
    description: 'The cart items',
  })
  cartItems: CartItemDto[];
}
