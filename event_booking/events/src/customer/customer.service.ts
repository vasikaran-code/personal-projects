import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class CustomerService {

  constructor(@InjectModel(Customer) private customer:typeof Customer){}

  async create(createCustomer: CreateCustomerDto):Promise<Customer|null> {
    const customer_id=Date.now();
    const {cust_name,email,password}=createCustomer;

    if(!cust_name || !email || !password){
      return ;
    }
    const newCustomer:any={customer_id:customer_id,...createCustomer}
    return this.customer.create(newCustomer);
  }

  findAll() {
    return  this.customer.findAll();
  }

    findOne(id: string) {
      return this.customer.findOne({where:{
        customer_id:id
      }});
    }

  async update(id: string, updateCustomer: UpdateCustomerDto) {
    const updated= await this.findOne(id)
    if(!updated)
      throw new NotFoundException("Customer Not Found")
    Object.assign(updated,updateCustomer)
    return updated.save()
  }

  remove(id: string) {
    const removed_data=this.customer.findOne({where:{customer_id:id}})
    if(!removed_data)
     throw new NotFoundException("Customer Not Found")
    this.customer.destroy({where:{
      customer_id:id
    }})
    return removed_data;
  }

  // async findCustomerWithOrders(customerId: string): Promise<Customer> {
  //   return await this.customer.findOne({
  //     where: { customer_id: customerId },
  //     include: [Order], // Include the orders in the result
  //   });
  // }
}
