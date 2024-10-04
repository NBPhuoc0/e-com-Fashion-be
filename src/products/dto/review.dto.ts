import {
  IsInt,
  IsString,
  IsDate,
  Min,
  Max,
  Length,
  IsNumber,
} from 'class-validator';

export class ReviewDto {
  @IsNumber()
  reviewId: number;

  @IsNumber()
  productId: number;

  @IsNumber()
  userId: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @Length(1, 500)
  comment: string;

  @IsDate()
  createdAt: Date;
}
