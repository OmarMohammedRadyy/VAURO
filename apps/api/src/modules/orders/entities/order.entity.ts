import { OrderStatus, PaymentStatus } from '../../../common/enums';

export interface OrderItemEntity {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderEntity {
  id: string;
  customerId: string;
  storeId: string;
  driverId?: string;
  status: OrderStatus;
  items: OrderItemEntity[];
  totalPrice: number;
  deliveryAddress: string;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}
