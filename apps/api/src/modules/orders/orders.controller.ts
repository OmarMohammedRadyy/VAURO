import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { OrderStatus, PaymentStatus } from '../../common/enums';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto, UpdatePaymentStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get()
  list(
    @Query('customerId') customerId?: string,
    @Query('storeId') storeId?: string,
    @Query('driverId') driverId?: string
  ) {
    return this.ordersService.list({ customerId, storeId, driverId });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() payload: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, payload.status);
  }

  @Patch(':id/payment')
  updatePayment(@Param('id') id: string, @Body() payload: UpdatePaymentStatusDto) {
    return this.ordersService.updatePaymentStatus(id, payload.paymentStatus);
  }

  @Patch(':id/assign-driver')
  assignDriver(@Param('id') id: string, @Body('driverId') driverId: string) {
    return this.ordersService.assignDriver(id, driverId);
  }
}
