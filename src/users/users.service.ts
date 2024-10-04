import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Cart } from 'src/entities/cart.entity';
import { CartItem } from 'src/entities/cart-item.entity';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ProductVariant } from 'src/entities/product-variant.entity';
import { signupDto } from 'src/auth/dto/signup.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
    await this.userRepository.save(user);
    const cart = this.cartRepository.create({
      user: user,
    });
    this.cartRepository.save(cart);
    return user;
  }

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneUser(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { userId: id } });
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update({ userId: id }, updateUserDto);
    return this.findOneUser(id);
  }

  async removeUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  //*  Cart CRUD operations

  async findAllCarts(): Promise<Cart[]> {
    return this.cartRepository.find();
  }

  async findCartByUserId(userId: number): Promise<Cart> {
    return this.cartRepository.findOne({ where: { user: { userId } } });
  }

  async updateCart(
    userId: number,
    productVariantId: number,
    quantity: number,
  ): Promise<CartItem | void> {
    if (quantity === 0) {
      throw new Error('Quantity must be a non-zero integer');
    }

    let cart = await this.findCartByUserId(userId);
    if (!cart) {
      cart = this.cartRepository.create({
        user: { userId },
      });
      await this.cartRepository.save(cart);
    }

    const cartItem = await this.cartItemRepository.findOne({
      where: {
        productVariant: { variantId: productVariantId },
        cart: { cartId: cart.cartId },
      },
    });

    if (cartItem) {
      // Update existing cart item
      cartItem.quantity += quantity;
      if (cartItem.quantity <= 0) {
        // Remove item if quantity is zero or negative
        await this.cartItemRepository.delete(cartItem.cartItemId);
        return;
      }
      return this.cartItemRepository.save(cartItem);
    } else if (quantity > 0) {
      // Add new cart item

      const newCartItem = this.cartItemRepository.create({
        productVariant: { variantId: productVariantId },
        cart: cart,
        quantity: quantity,
      });
      return this.cartItemRepository.save(newCartItem);
    } else {
      throw new Error('Cannot remove non-existing item from cart');
    }
  }
}
