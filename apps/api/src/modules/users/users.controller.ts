import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../../common/enums';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.usersService.authenticate(loginDto);
  }

  @Get()
  findAll(@Query('role') role?: UserRole) {
    return this.usersService.findAll(role);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id/seller-status')
  updateSellerStatus(
    @Param('id') id: string,
    @Body('status') status: 'pending' | 'approved' | 'rejected'
  ) {
    return this.usersService.updateSellerStatus(id, status);
  }

  @Patch(':id/driver-status')
  updateDriverStatus(
    @Param('id') id: string,
    @Body('status') status: 'pending' | 'approved' | 'rejected'
  ) {
    return this.usersService.updateDriverStatus(id, status);
  }
}
