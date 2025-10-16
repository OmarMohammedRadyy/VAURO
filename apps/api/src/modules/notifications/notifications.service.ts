import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NotificationEntity } from './notification.entity';

@Injectable()
export class NotificationsService {
  private notifications: NotificationEntity[] = [];

  notify(userId: string, type: string, message: string): NotificationEntity {
    const notification: NotificationEntity = {
      id: randomUUID(),
      userId,
      type,
      message,
      read: false,
      createdAt: new Date()
    };
    this.notifications.push(notification);
    return notification;
  }

  list(userId: string): NotificationEntity[] {
    return this.notifications.filter((notification) => notification.userId === userId);
  }

  markAsRead(id: string): NotificationEntity | undefined {
    const notification = this.notifications.find((item) => item.id === id);
    if (notification) {
      notification.read = true;
    }
    return notification;
  }
}
