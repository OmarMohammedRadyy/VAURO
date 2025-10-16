import { GeoLocation } from '../../../common/geo';
import { StoreStatus } from '../../../common/enums';

export interface StoreEntity {
  id: string;
  sellerId: string;
  name: string;
  categoryId: string;
  description?: string;
  address: string;
  location?: GeoLocation;
  rating: number;
  status: StoreStatus;
  deliveryFee: number;
  estimatedDeliveryMinutes: number;
}
