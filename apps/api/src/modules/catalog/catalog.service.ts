import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { CategoryEntity } from './entities/category.entity';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class CatalogService {
  private categories: CategoryEntity[] = [];
  private products: ProductEntity[] = [];

  createCategory(dto: CreateCategoryDto): CategoryEntity {
    const category: CategoryEntity = {
      id: randomUUID(),
      name: dto.name,
      parentId: dto.parentId
    };
    this.categories.push(category);
    return category;
  }

  listCategories(): CategoryEntity[] {
    return this.categories;
  }

  createProduct(dto: CreateProductDto): ProductEntity {
    const product: ProductEntity = {
      id: randomUUID(),
      name: dto.name,
      description: dto.description ?? '',
      price: dto.price,
      stock: dto.stock,
      storeId: dto.storeId,
      imageUrl: dto.imageUrl,
      isActive: dto.isActive ?? true,
      categoryId: dto.categoryId,
      options: dto.options ?? []
    };
    this.products.push(product);
    return product;
  }

  listProducts(filters?: { storeId?: string; categoryId?: string; onlyActive?: boolean }) {
    return this.products.filter((product) => {
      if (filters?.storeId && product.storeId !== filters.storeId) {
        return false;
      }
      if (filters?.categoryId && product.categoryId !== filters.categoryId) {
        return false;
      }
      if (filters?.onlyActive && !product.isActive) {
        return false;
      }
      return true;
    });
  }

  updateProduct(id: string, updates: Partial<ProductEntity>): ProductEntity {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
      throw new NotFoundException('Product not found');
    }
    const current = this.products[index];
    const updated = { ...current, ...updates };
    this.products[index] = updated;
    return updated;
  }
}
