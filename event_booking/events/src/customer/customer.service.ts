import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { randomBytes } from 'crypto';
import { col, fn, Op, where } from 'sequelize';
import { AuthUser } from '../auth/auth.decorators';
import { PasswordService } from '../auth/password.service';
import { TokenService } from '../auth/token.service';
import { Order } from '../orders/models/order.model';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { LoginCustomerDto } from './dto/login-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

const newCustomerId = () => `cust_${randomBytes(5).toString('hex')}`;

const emailEquals = (email: string) =>
  where(fn('lower', col('email')), email.toLowerCase());

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer) private customer: typeof Customer,
    @InjectModel(Order) private order: typeof Order,
    private passwords: PasswordService,
    private tokens: TokenService,
  ) {}

  async create(dto: CreateCustomerDto): Promise<Customer> {
    await this.assertEmailAvailable(dto.email);
    return this.customer.create({
      customer_id: newCustomerId(),
      cust_name: dto.cust_name,
      email: dto.email,
      password: await this.passwords.hash(dto.password),
      isAdmin: false,
    } as Customer);
  }

  async login({ email, password }: LoginCustomerDto) {
    const customer = await this.customer.findOne({ where: emailEquals(email) });
    const valid =
      customer && (await this.passwords.verify(password, customer.password));
    if (!valid) {
      throw new UnauthorizedException('Incorrect email or password');
    }
    // Upgrade accounts that still store a plaintext password.
    if (!this.passwords.isHashed(customer.password)) {
      customer.password = await this.passwords.hash(password);
      await customer.save();
    }
    return {
      access_token: this.tokens.sign(customer.customer_id),
      customer,
    };
  }

  findAll() {
    return this.customer.findAll();
  }

  async findOne(id: string, user: AuthUser) {
    this.assertSelfOrAdmin(id, user);
    const customer = await this.customer.findOne({
      where: { customer_id: id },
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto, user: AuthUser) {
    const customer = await this.findOne(id, user);
    if (dto.email !== undefined) await this.assertEmailAvailable(dto.email, id);

    if (dto.cust_name !== undefined) customer.cust_name = dto.cust_name;
    if (dto.email !== undefined) customer.email = dto.email;
    if (dto.password !== undefined) {
      customer.password = await this.passwords.hash(dto.password);
    }
    return customer.save();
  }

  async remove(id: string, user: AuthUser) {
    const customer = await this.findOne(id, user);
    const bookings = await this.order.count({ where: { customer_id: id } });
    if (bookings > 0) {
      throw new ConflictException(
        'This account has bookings and cannot be deleted.',
      );
    }
    await customer.destroy();
    return customer;
  }

  private assertSelfOrAdmin(id: string, user: AuthUser) {
    if (!user.isAdmin && user.customer_id !== id) {
      throw new ForbiddenException('You can only access your own account.');
    }
  }

  private async assertEmailAvailable(email: string, exceptId?: string) {
    const conditions: any[] = [emailEquals(email)];
    if (exceptId) conditions.push({ customer_id: { [Op.ne]: exceptId } });
    const existing = await this.customer.findOne({
      where: { [Op.and]: conditions },
      attributes: ['customer_id'],
    });
    if (existing) {
      throw new ConflictException('An account with this email already exists.');
    }
  }
}
