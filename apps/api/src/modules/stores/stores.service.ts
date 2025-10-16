import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { StoreStatus } from '../../common/enums';
import { GeoLocation, haversineDistance } from '../../common/geo';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoreEntity } from './entities/store.entity';

@Injectable()
export class StoresService {
  private stores: StoreEntity[] = [];

  create(dto: CreateStoreDto): StoreEntity {
    const store: StoreEntity = {
      id: randomUUID(),
      sellerId: dto.sellerId,
      name: dto.name,
      categoryId: dto.categoryId,
      description: dto.description,
      address: dto.address,
      location:
        dto.latitude && dto.longitude
          ? { latitude: dto.latitude, longitude: dto.longitude }
          : undefined,
      rating: 0,
      status: dto.status ?? StoreStatus.PENDING,
      deliveryFee: dto.deliveryFee,
      estimatedDeliveryMinutes: dto.estimatedDeliveryMinutes
    };
    this.stores.push(store);
    return store;
  }

  list(status?: StoreStatus): StoreEntity[] {
    return this.stores.filter((store) => (status ? store.status === status : true));
  }

  updateStatus(id: string, status: StoreStatus): StoreEntity {
    const store = this.stores.find((candidate) => candidate.id === id);
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    store.status = status;
    return store;
  }

  findNearby(location: GeoLocation, radiusKm = 10, limit = 10) {
    return this.stores
      .filter((store) => store.location)
      .map((store) => {
        const distance = store.location ? haversineDistance(location, store.location) : Infinity;
        return {
          ...store,
          distance,
          eta: Math.round(store.estimatedDeliveryMinutes + distance * 2)
        };
      })
      .filter((store) => store.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
  }
}
