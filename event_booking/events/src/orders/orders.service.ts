import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './models/order.model';
import { Customer } from 'src/customer/entities/customer.entity';

@Injectable()
export class OrdersService {

  constructor(@InjectModel(Order) private order:typeof Order,
              @InjectModel(Customer) private customer:typeof Customer){}
 
  // async create(createOrderDto: CreateOrderDto):Promise<Order> {
  //   const {name, event_type, event_date,level, contact, mail_id}=createOrderDto;
  //   if(!name || !event_type || !event_date || !level || !contact  || !mail_id){
  //     return null ;
  // }
  //   const order_id=`ord_${Math.random().toString(36).substr(2,16)}`;
  //   const status="pending"
  //   const order_data:any={order_id:order_id,status:status,customer_id,...createOrderDto}
  //   return this.order.create(order_data) ;
  // }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { name, event_type, event_date, level, contact, mail_id, customer_id,venue } = createOrderDto;

    if (!name || !event_type || !event_date || !level || !contact || !mail_id || !customer_id) {
      throw new Error('Missing required fields');
    }
    const customer = await this.customer.findOne({ where: { customer_id } });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customer_id} not found`);
    }
    const order_id = `ord_${Math.random().toString(36).substr(2, 16)}`;
    const status = 'pending';
    
    const orderData = {
      order_id,
      status,
      customer_id, 
      ...createOrderDto
    };
    const newOrder = await this.order.create(orderData);
    return newOrder;
  }


  async findAll() {
      return this.order.findAll()
  }

  findOne(id: string) {
    return this.order.findOne({where:{ 
        order_id:id
      }}); 
    }   

  async update(id: string, data: UpdateOrderDto):Promise<Order>  {
  const updated= await this.order.findOne({where:{order_id:id}});
  if(!updated){
    throw new NotFoundException("order Not Found")
  }
  Object.assign(updated,data)
    return updated.save()
  }

  remove(id: string):Promise<Order>  {
   const removed_data=this.order.findOne({where:{order_id:id}})
   if(!removed_data)
    throw new NotFoundException("Order Not Found")
   this.order.destroy({where:{
    order_id:id
   }})
   return removed_data;
  }

}
