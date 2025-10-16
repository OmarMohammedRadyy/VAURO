import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post('categories')
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.catalogService.createCategory(dto);
  }

  @Get('categories')
  listCategories() {
    return this.catalogService.listCategories();
  }

  @Post('products')
  createProduct(@Body() dto: CreateProductDto) {
    return this.catalogService.createProduct(dto);
  }

  @Get('products')
  listProducts(
    @Query('storeId') storeId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('onlyActive') onlyActive?: string
  ) {
    return this.catalogService.listProducts({
      storeId,
      categoryId,
      onlyActive: onlyActive === 'true'
    });
  }

  @Patch('products/:id')
  updateProduct(@Param('id') id: string, @Body() payload: Record<string, unknown>) {
    return this.catalogService.updateProduct(id, payload);
  }
}
