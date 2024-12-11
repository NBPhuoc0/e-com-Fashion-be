import { PartialType } from '@nestjs/swagger';
import { PromotionDto } from './promotion.dto';

export class PromotionUpdateDto extends PartialType(PromotionDto) {}
