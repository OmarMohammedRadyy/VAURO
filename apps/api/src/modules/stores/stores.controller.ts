import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { StoreStatus } from '../../common/enums';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  create(@Body() dto: CreateStoreDto) {
    return this.storesService.create(dto);
  }

  @Get()
  list(@Query('status') status?: string) {
    const normalized = status as StoreStatus | undefined;
    return this.storesService.list(normalized);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: StoreStatus) {
    return this.storesService.updateStatus(id, status);
  }

  @Get('nearby')
  nearby(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
    @Query('radiusKm') radiusKm?: string,
    @Query('limit') limit?: string
  ) {
    const parsedLatitude = parseFloat(latitude);
    const parsedLongitude = parseFloat(longitude);
    return this.storesService.findNearby(
      { latitude: parsedLatitude, longitude: parsedLongitude },
      radiusKm ? parseFloat(radiusKm) : 10,
      limit ? parseInt(limit, 10) : 10
    );
  }
}
