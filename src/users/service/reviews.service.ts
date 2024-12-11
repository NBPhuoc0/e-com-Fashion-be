import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../../entities/review.entity';
import { ReviewDto } from '../dto/review.dto';
import { ProductsService } from 'src/products/service/products.service';
import { UsersService } from 'src/users/service/users.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    private usersService: UsersService,
  ) {}

  create(createReviewDto: ReviewDto): Review {
    const review = this.reviewsRepository.create(createReviewDto);
    // review.product = createReviewDto.product;
    // review.user = createReviewDto.user;
    // review.rating = createReviewDto.rating;
    // review.comment = createReviewDto.comment;
    // return this.reviewsRepository.save(review);
    return review;
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
