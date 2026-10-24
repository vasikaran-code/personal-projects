import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Customer } from './entities/customer.entity';
import { Order } from 'src/orders/models/order.model';
import { CustomerOrder } from './entities/CustomerOrder';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [SequelizeModule.forFeature([Customer])],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports:[SequelizeModule]
})
export class CustomerModule {}
