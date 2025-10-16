import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { StoresModule } from './stores/stores.module';
import { CatalogModule } from './catalog/catalog.module';
import { OrdersModule } from './orders/orders.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [UsersModule, StoresModule, CatalogModule, OrdersModule, NotificationsModule]
})
export class AppModule {}
