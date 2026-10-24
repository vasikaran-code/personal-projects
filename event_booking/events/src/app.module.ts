import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './orders/models/order.model';
import { CustomerModule } from './customer/customer.module';
import { Customer } from './customer/entities/customer.entity';
// import { FecilitiesModule } from './fecilities/fecilities.module';
// import { Fecility } from './fecilities/entities/fecility.entity';

@Module({
  imports: [SequelizeModule.forRoot( {
    dialect: 'postgres',
    host: '127.0.0.1',
    port: 5432,
    username: 'postgres',
    password: '12345',
    database: 'postgres',
    models: [Order,Customer],
    logging: false,
    autoLoadModels:true,
    synchronize:true
  }),
    SequelizeModule.forFeature([Customer,Order]),
    OrdersModule,
    CustomerModule,
    // FecilitiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
