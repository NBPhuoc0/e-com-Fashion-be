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
import { ApiBody, ApiProperty, ApiTags } from '@nestjs/swagger';
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
import { PagingDto } from 'src/products/dto/paging.dto';
import { MonthlyDto } from './dto/monthly.dto';
import { OrderDetailService } from 'src/orders/service/order-detail.service';

@Controller('admin')
@ApiTags('admin')
export class AdminController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
    private readonly promtionService: PromotionsService,
    private readonly vouchersService: VouchersService,
    private readonly ordersService: OrdersService,
    private readonly orderDetailService: OrderDetailService,
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
    // this.logger.log('Upload product image ' + files);
    const variant = await this.productsService.findVariantByIdWithProd(id);
    if (!variant) {
      throw new NotFoundException('Variant not found');
    }
    // return variant;
    try {
      const imgUrls = files.map((photo, i) => {
        return this.s3ClientService.uploadFileToPublicBucket(
          `${variant.product.productId}/${variant.variantId}-${i}`,
          photo,
        );
      });
      // this.logger.log('Image urls ' + imgUrls);
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
  findAll(@Query() dto: PagingDto) {
    return this.productsService.findAll(dto.page, dto.skip);
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
    this.logger.log('Get all orders');
    return this.ordersService.findAll();
  }

  @Get('orders/:id')
  async getOrder(@Param('id') id: number) {
    const order = await this.ordersService.findOne(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  //* USERS
  @Get('users')
  getUsers() {
    this.logger.log('Get all users');
    return this.usersService.findAllUsers();
  }

  //* DASHBOAR - STATISTICS - REVENUE
  @Post('statistics/monthlyrevenue')
  getMothlyRevenue(@Body() dto: MonthlyDto) {
    this.logger.log('Get monthly revenue');
    return this.ordersService.getMonthlyRevenue(2024, 10);
  }

  @Get('statistics/topcategories')
  getOrdersRevenue() {
    this.logger.log('Get top categories');
    return this.orderDetailService.getRevenueByCategory();
  }

  @Get('statistics/topproducts')
  getTopProducts() {
    this.logger.log('Get top products');
    return this.orderDetailService.getTopSellingProducts();
  }
}
