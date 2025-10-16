import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Body('userId') userId: string, @Body('type') type: string, @Body('message') message: string) {
    return this.notificationsService.notify(userId, type, message);
  }

  @Get(':userId')
  list(@Param('userId') userId: string) {
    return this.notificationsService.list(userId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }
}
