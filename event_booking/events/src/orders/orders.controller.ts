import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AdminOnly, AuthUser, CurrentUser } from '../auth/auth.decorators';
import { ParseIdPipe } from '../common/parse-id.pipe';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './models/order.model';
import { OrdersService } from './orders.service';

// Customers see and manage only their own bookings; admins see all of them.
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: AuthUser,
  ): Promise<Order> {
    return this.ordersService.create(createOrderDto, user);
  }

  @Get()
  findAll(@CurrentUser() user: AuthUser): Promise<Order[]> {
    return this.ordersService.findAll(user);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIdPipe) id: string,
    @CurrentUser() user: AuthUser,
  ): Promise<Order> {
    return this.ordersService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIdPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.ordersService.update(id, updateOrderDto, user);
  }

  @AdminOnly()
  @Delete(':id')
  remove(@Param('id', ParseIdPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.ordersService.remove(id, user);
  }
}
