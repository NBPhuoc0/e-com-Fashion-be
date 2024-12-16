import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Cart } from 'src/entities/cart.entity';
import { CartItem } from 'src/entities/cart-item.entity';
import { signupDto } from 'src/auth/dto/signup.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ProductVariant } from 'src/entities/product-variant.entity';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  //* */ User CRUD operations
  async createUser(createUserDto: signupDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    user.carts = this.cartRepository.create();
    user.carts.cartItems = [];
    user.reviews = [];
    await this.userRepository.save(user);
    return user;
  }

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneUser(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { userId: id },
      relations: ['carts', 'carts.cartItems', 'carts.cartItems.productVariant'],
      select: [
        'userId',
        'fullName',
        'email',
        'address',
        'phoneNumber',
        'carts',
        'dateOfBirth',
        'gender',
      ],
    });
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['carts'],
    });
  }

  async updateUserProfile(
    id: number,
    updateUserDto: Partial<UpdateUserDto>,
  ): Promise<User> {
    await this.userRepository.update({ userId: id }, updateUserDto);
    return this.findOneUser(id);
  }

  async updateUser(user: User): Promise<User> {
    await this.userRepository.save(user);
    return user;
  }

  async removeUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  //*  Cart CRUD operations

  async findAllCarts(): Promise<Cart[]> {
    return this.cartRepository.find();
  }

  async updateCart(
    user: User,
    productVariant: ProductVariant,
    quantity: number,
  ): Promise<CartItem | void> {
    if (quantity === 0) {
      throw new BadRequestException('Quantity must be a non-zero integer');
    }

    const cart = user.carts;
    const cartItem = await this.cartItemRepository.findOne({
      where: {
        productVariant: productVariant,
        cart: { cartId: cart.cartId },
      },
    });

    if (cartItem) {
      // Update existing cart item
      cartItem.quantity += quantity;
      if (cartItem.quantity <= 0) {
        // Remove item if quantity is zero or negative
        await this.cartItemRepository.remove(cartItem);
        return;
      }
      return this.cartItemRepository.save(cartItem);
    } else if (quantity > 0) {
      // Add new cart item

      const newCartItem = this.cartItemRepository.create({
        productVariant: productVariant,
        productId: productVariant.product.productId,
        productName: productVariant.product.productName,
        price: productVariant.product.price,
        promotionPrice: productVariant.product.promotionPrice,
        cart: cart,
        quantity: quantity,
      });
      return this.cartItemRepository.save(newCartItem);
    } else {
      throw new BadRequestException(
        'Cannot remove non-existing item from cart',
      );
    }
  }
}
