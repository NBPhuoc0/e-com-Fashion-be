import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { promotionDto } from './dto/promotion.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Promotions')
@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post()
  create(@Body() dto: promotionDto) {
    return this.promotionsService.createPromotion(dto);
  }

  @Get()
  findAll() {
    return this.promotionsService.getPromotions();
  }
}
