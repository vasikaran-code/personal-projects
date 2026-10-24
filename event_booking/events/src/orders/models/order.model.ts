import { AllowNull, BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table, } from "sequelize-typescript"
import { Customer } from "src/customer/entities/customer.entity";
import { CustomerOrder } from "src/customer/entities/CustomerOrder";

@Table({tableName:"orders"})
export class Order extends Model<Order> {

    @Column({
        type: DataType.STRING,
        primaryKey: true,
    })
    order_id: string;

    @Column({ type: DataType.STRING,allowNull: false,})
    name: string

    @Column({ type: DataType.STRING,allowNull: false  })
    event_type: string

    @Column({ type: DataType.STRING, allowNull: false,})
    event_date:string

    @Column({ type: DataType.STRING , allowNull: false})
    level: string

    @Column({type:DataType.STRING,allowNull:false,})
    venue:string
    
    @Column({ type: DataType.STRING , allowNull: false,})
    contact: string

    @Column({ type: DataType.STRING })
    alternative_contact?: string

    @Column({ type: DataType.STRING,allowNull: false })
    mail_id: string

    @Column({type:DataType.STRING})
    status:string

    @ForeignKey(()=>Customer)
    @Column({ type: DataType.STRING})
    customer_id:string

     @BelongsTo(() => Customer,)
    customers: Customer[];

    // @BelongsTo(()=>Customer)
    // customer:Customer;
}