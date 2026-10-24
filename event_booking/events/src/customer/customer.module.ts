import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from '../orders/models/order.model';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';

@Module({
  imports: [SequelizeModule.forFeature([Customer, Order])],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [SequelizeModule],
})
export class CustomerModule {}
