import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { OrderStatus, PaymentStatus } from '../../common/enums';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderEntity } from './entities/order.entity';

@Injectable()
export class OrdersService {
  private orders: OrderEntity[] = [];

  create(dto: CreateOrderDto): OrderEntity {
    const totalPrice = dto.items.reduce(
      (acc, item) => acc + item.quantity * item.unitPrice,
      0
    );

    const order: OrderEntity = {
      id: randomUUID(),
      customerId: dto.customerId,
      storeId: dto.storeId,
      status: OrderStatus.PENDING,
      driverId: undefined,
      items: dto.items,
      totalPrice,
      deliveryAddress: dto.deliveryAddress,
      paymentStatus: PaymentStatus.UNPAID,
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: dto.notes
    };

    this.orders.push(order);
    return order;
  }

  list(filters?: { customerId?: string; storeId?: string; driverId?: string }) {
    return this.orders.filter((order) => {
      if (filters?.customerId && order.customerId !== filters.customerId) {
        return false;
      }
      if (filters?.storeId && order.storeId !== filters.storeId) {
        return false;
      }
      if (filters?.driverId && order.driverId !== filters.driverId) {
        return false;
      }
      return true;
    });
  }

  findOne(id: string): OrderEntity {
    const order = this.orders.find((candidate) => candidate.id === id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  updateStatus(id: string, status: OrderStatus): OrderEntity {
    const order = this.findOne(id);
    order.status = status;
    order.updatedAt = new Date();
    return order;
  }

  updatePaymentStatus(id: string, paymentStatus: PaymentStatus): OrderEntity {
    const order = this.findOne(id);
    order.paymentStatus = paymentStatus;
    order.updatedAt = new Date();
    return order;
  }

  assignDriver(id: string, driverId: string): OrderEntity {
    const order = this.findOne(id);
    order.driverId = driverId;
    order.status = OrderStatus.ON_THE_WAY;
    order.updatedAt = new Date();
    return order;
  }
}
