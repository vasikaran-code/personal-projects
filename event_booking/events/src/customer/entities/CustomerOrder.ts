import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Customer } from "./customer.entity";
import { Order } from "src/orders/models/order.model";

@Table({tableName:"customer_order"})
export class CustomerOrder extends Model<CustomerOrder>{

    @ForeignKey(()=>Customer)
    @Column
    customer_id:string


    @ForeignKey(()=>Order)
    @Column
    order_id:string
}