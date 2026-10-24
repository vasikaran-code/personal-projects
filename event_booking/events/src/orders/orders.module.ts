import { CustomerModule } from './../customer/customer.module';
import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './models/order.model';

@Module({
  imports: [SequelizeModule.forFeature([Order]),CustomerModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
