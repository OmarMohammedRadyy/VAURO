export type OrderStatus = 'pending' | 'preparing' | 'on_the_way' | 'delivered' | 'failed';

export interface OrderSummary {
  id: string;
  storeName: string;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
}
