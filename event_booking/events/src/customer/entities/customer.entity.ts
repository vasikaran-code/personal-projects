import { Table, Model, Column, DataType, Default } from 'sequelize-typescript';

@Table({ tableName: 'customer' })
export class Customer extends Model<Customer> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  customer_id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  cust_name: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isAdmin: boolean;

  // Never serialize the password hash into API responses.
  toJSON() {
    const values = { ...this.get() } as Partial<Customer>;
    delete values.password;
    return values as any;
  }

  // @BelongsToMany(()=>Order,()=>CustomerOrder)
  // orders:Order[]
}

// @HasMany(()=>Order)
// booked_orders:Order[]
