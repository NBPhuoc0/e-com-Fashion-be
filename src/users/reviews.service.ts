import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { ReviewDto } from './dto/review.dto';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    private productsService: ProductsService,
    private usersService: UsersService,
  ) {}

  async create(createReviewDto: ReviewDto): Promise<Review> {
    const review = this.reviewsRepository.create();
    await this.productsService
      .findOne(createReviewDto.productId)
      .then((product) => {
        if (!product) {
          throw new NotFoundException('Product not found');
        }
        review.product = product;
      });

    review.user = createReviewDto.user;
    review.rating = createReviewDto.rating;
    review.comment = createReviewDto.comment;
    return this.reviewsRepository.save(review);
  }

  findAll(): Promise<Review[]> {
    return this.reviewsRepository.find();
  }

  findOne(id: number): Promise<Review> {
    return this.reviewsRepository.findOneBy({ reviewId: id });
  }

  async findByProductId(
    productId: number,
    page: number = 0,
    skip: number = 10,
  ): Promise<Review[]> {
    const take = skip;
    const offset = page * skip;
    return this.reviewsRepository.find({
      where: { product: { productId } },
      skip: offset,
      take,
    });
  }

  async findByUserId(userId: number): Promise<Review[]> {
    return this.reviewsRepository.find({
      where: { user: { userId } },
    });
  }

  async update(
    id: number,
    updateReviewDto: Partial<ReviewDto>,
  ): Promise<Review> {
    await this.reviewsRepository.update(id, updateReviewDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.reviewsRepository.delete(id);
  }
}
