import { Controller, Get, Res } from '@nestjs/common';
import { CategoriesService } from './products/service/product-categories.service';
import { PromotionsService } from './promotion/services/promotions.service';

@Controller()
export class AppController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly promotionsService: PromotionsService,
  ) {}

  @Get()
  index(@Res() res) {
    res.status(302).redirect('/api/docs');
  }

  @Get('mega-menu')
  async getMegaMenu() {
    const cate = await this.categoriesService.findTree();
    const promo = await this.promotionsService.getPromotions();

    return {
      categories: cate,
      promotions: promo,
    };
  }
}
