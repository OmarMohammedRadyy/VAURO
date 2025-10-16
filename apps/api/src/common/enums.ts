export enum UserRole {
  CUSTOMER = 'customer',
  SELLER = 'seller',
  DRIVER = 'driver',
  ADMIN = 'admin'
}

export enum StoreStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended'
}

export enum OrderStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  ON_THE_WAY = 'on_the_way',
  DELIVERED = 'delivered',
  FAILED = 'failed'
}

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
  REFUNDED = 'refunded'
}
