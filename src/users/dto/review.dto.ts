import {
  IsInt,
  IsString,
  IsDate,
  Min,
  Max,
  Length,
  IsNumber,
} from 'class-validator';
import { User } from 'src/entities/user.entity';

export class ReviewDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @Length(1, 500)
  comment: string;

  @IsDate()
  createdAt: Date;

  user: User;
}
