import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ProductsService } from 'src/products/service/products.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';
import { ProductCategory } from 'src/entities/category.entity';
import { S3ClientService } from 'src/common/s3-client/s3-client.service';
import { CategoriesService } from 'src/products/service/product-categories.service';
import { Order } from 'src/entities/order.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(ProductCategory)
    private categoriesRepository: Repository<ProductCategory>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
}
