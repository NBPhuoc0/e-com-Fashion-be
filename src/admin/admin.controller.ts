import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseInterceptors,
  UploadedFiles,
  Logger,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductsService } from 'src/products/service/products.service';
import { CategoriesService } from 'src/products/service/product-categories.service';
import { S3ClientService } from 'src/common/services/s3-client.service';
import { ProductDto } from 'src/products/dto/product.dto';
import { CategoryDto } from 'src/products/dto/category.dto';
import { PromotionsService } from 'src/promotion/services/promotions.service';
import { VouchersService } from 'src/promotion/services/voucher.service';
import { PromotionUpdateDto } from 'src/promotion/dto/promotion-update.dto';
import { PromotionDto } from 'src/promotion/dto/promotion.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { VoucherDto } from 'src/promotion/dto/voucher.dto';
import { OrdersService } from 'src/orders/service/orders.service';
import { UsersService } from 'src/users/service/users.service';

@Controller('admin')
@ApiTags('admin')
export class AdminController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
    private readonly promtionService: PromotionsService,
    private readonly vouchersService: VouchersService,
    private readonly ordersService: OrdersService,
    private readonly usersService: UsersService,
    private readonly s3ClientService: S3ClientService,
  ) {}

  private logger = new Logger('AdminController');

  //* PRODUCTS
  @Post('products')
  createProduct(@Body() createProductDto: ProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Patch('products/:id')
  updateProduct(@Param('id') id: number, @Body() updateProductDto: ProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Patch('products/variant/:id/photos')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadProductImage(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('id') id: number,
  ) {
    const variant = await this.productsService.findVariantById(id);
    if (!variant) {
      throw new NotFoundException('Variant not found');
    }
    try {
      const imgUrls = files.map((photo, i) => {
        return this.s3ClientService.uploadFileToPublicBucket(
          `${variant.product.productId}/${variant.variantId}-${i}`,
          photo,
        );
      });
      return this.productsService.updatePhotoVariant(variant, imgUrls);
    } catch (error) {
      throw new InternalServerErrorException('Error uploading image');
    }
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: number) {
    return this.productsService.remove(id);
  }

  @Get('products')
  findAll(@Query('page') page: number, @Query('skip') skip: number) {
    return this.productsService.findAll(page, skip);
  }

  //* CATEGORIES
  @Post('categories')
  createCategory(@Body() createCategoryDto: CategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Patch('categories/:id')
  updateCategory(
    @Param('id') id: number,
    @Body() updateCategoryDto: CategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: number) {
    return this.categoriesService.remove(id);
  }

  @Get('categories')
  getCategories() {
    return this.categoriesService.findAll();
  }

  @Get('categories/tree')
  getParentCategory() {
    return this.categoriesService.findTree();
  }

  @Get('categories/:id')
  getCategory(@Param('id') id: number) {
    return this.categoriesService.findOne(id);
  }

  //* PROMOTIONS
  @Post('promotions')
  createPromotion(@Body() dto: PromotionDto) {
    return this.promtionService.createPromotion(dto);
  }

  @Get('promotions')
  getPromotions() {
    return this.promtionService.getPromotions();
  }

  @Get('promotions/:id')
  async getPromotion(@Param('id') id: number) {
    const prom = await this.promtionService.getPromotionWithProdsById(id);
    if (!prom) {
      throw new NotFoundException('Promotion not found');
    }
    return prom;
  }

  @Patch('promotions/:id')
  async updatePromotion(
    @Param('id') id: number,
    @Body() dto: PromotionUpdateDto,
  ) {
    const prom = await this.promtionService.updatePromotion(id, dto);
    if (!prom) {
      throw new NotFoundException('Promotion not found');
    }
    return prom;
  }

  @Patch('promotions/:id/switch')
  async deactivatePromotion(@Param('id') id: number) {
    const prom = await this.promtionService.getPromotionById(id);
    if (!prom) {
      throw new NotFoundException('Promotion not found');
    }
    return this.promtionService.updateStatus(prom);
  }

  @Delete('promotions/:id')
  deletePromotion(@Param('id') id: number) {
    return this.promtionService.remove(id);
  }

  //* VOUCHERS
  @Post('vouchers')
  createVoucher(@Body() dto: VoucherDto) {
    return this.vouchersService.create(dto);
  }

  @Get('vouchers')
  getVouchers() {
    return this.vouchersService.findAll();
  }

  @Get('vouchers/:id')
  async getVoucher(@Param('id') id: number) {
    const voucher = await this.vouchersService.findOne(id);
    if (!voucher) {
      throw new NotFoundException('Voucher not found');
    }
    return voucher;
  }

  @Patch('vouchers/:id/switch')
  async updateVoucherStatus(@Param('id') id: number) {
    const voucher = await this.vouchersService.updateVoucherStatus(id);
    if (!voucher) {
      throw new NotFoundException('Voucher not found');
    }
    return voucher;
  }

  @Delete('vouchers/:id')
  deleteVoucher(@Param('id') id: number) {
    return this.vouchersService.delete(id);
  }

  //* ORDERS
  @Get('orders')
  getOrders() {
    return this.ordersService.findAll();
  }

  //* USERS
  @Get('users')
  getUsers() {
    return this.usersService.findAllUsers();
  }
}
