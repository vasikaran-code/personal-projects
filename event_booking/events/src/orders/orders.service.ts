import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { randomBytes } from 'crypto';
import { col, fn, Op, Transaction, where } from 'sequelize';
import { AuthUser } from '../auth/auth.decorators';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './models/order.model';
import {
  ACTIVE_STATUSES,
  checkTransition,
  isPastDate,
  normalizeStatus,
  ORDER_STATUS,
} from './order.rules';

const newOrderId = () => `ord_${randomBytes(8).toString('hex')}`;

type BookingSlot = Pick<
  Order,
  'customer_id' | 'event_type' | 'event_date' | 'venue'
>;

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order) private order: typeof Order) {}

  async create(dto: CreateOrderDto, user: AuthUser): Promise<Order> {
    const { customer_id: requestedOwner, ...fields } = dto;
    if (requestedOwner !== undefined && requestedOwner !== user.customer_id) {
      throw new ForbiddenException(
        'You can only make bookings for your own account.',
      );
    }
    if (isPastDate(fields.event_date)) {
      throw new BadRequestException('The event date cannot be in the past.');
    }

    const data = {
      ...fields,
      order_id: newOrderId(),
      status: ORDER_STATUS.PENDING,
      customer_id: user.customer_id,
    };

    // Serialised per customer so a double-submitted form cannot slip two
    // identical requests past the duplicate check.
    return this.withCustomerLock(user.customer_id, async (transaction) => {
      await this.assertNoDuplicate(data, undefined, transaction);
      return this.order.create(data as Order, { transaction });
    });
  }

  findAll(user: AuthUser) {
    return user.isAdmin
      ? this.order.findAll()
      : this.order.findAll({ where: { customer_id: user.customer_id } });
  }

  async findOne(id: string, user: AuthUser) {
    const order = await this.order.findOne({ where: { order_id: id } });
    if (!order) throw new NotFoundException('Booking not found');
    if (!user.isAdmin && order.customer_id !== user.customer_id) {
      throw new ForbiddenException('You can only access your own bookings.');
    }
    return order;
  }

  async update(
    id: string,
    dto: UpdateOrderDto,
    user: AuthUser,
  ): Promise<Order> {
    const order = await this.findOne(id, user);
    const { status, ...rest } = dto;
    const changes = Object.fromEntries(
      Object.entries(rest).filter(([, value]) => value !== undefined),
    ) as Partial<Order>;
    const editsDetails = Object.keys(changes).length > 0;

    if (!status && !editsDetails) {
      throw new BadRequestException('No changes were provided.');
    }

    const currentStatus = order.status;
    const eventDate = changes.event_date ?? order.event_date;

    if (editsDetails) {
      if (normalizeStatus(currentStatus) !== ORDER_STATUS.PENDING) {
        throw new ConflictException('Only pending bookings can be edited.');
      }
      if (changes.event_date && isPastDate(changes.event_date)) {
        throw new BadRequestException('The event date cannot be in the past.');
      }
    }

    if (status) {
      const check = checkTransition(currentStatus, status, {
        isAdmin: user.isAdmin,
        isOwner: order.customer_id === user.customer_id,
      });
      if (check === 'forbidden') {
        throw new ForbiddenException(
          `You are not allowed to mark this booking as ${status}.`,
        );
      }
      if (check === 'invalid') {
        throw new ConflictException(
          `A ${currentStatus} booking cannot be marked as ${status}.`,
        );
      }
      if (status === ORDER_STATUS.CONFIRMED && isPastDate(eventDate)) {
        throw new ConflictException(
          'A booking for a past date cannot be confirmed.',
        );
      }
    }

    const values = { ...changes, ...(status ? { status } : {}) };
    const slotChanged = ['event_type', 'event_date', 'venue'].some(
      (k) => k in changes,
    );
    const staysActive = ACTIVE_STATUSES.includes(
      normalizeStatus(status ?? currentStatus),
    );

    const apply = async (transaction?: Transaction) => {
      if (slotChanged && staysActive) {
        await this.assertNoDuplicate(
          {
            customer_id: order.customer_id,
            event_type: changes.event_type ?? order.event_type,
            event_date: eventDate,
            venue: changes.venue ?? order.venue,
          },
          order.order_id,
          transaction,
        );
      }
      // Conditional on the status we validated against, so two concurrent
      // decisions (e.g. confirm and reject) cannot both succeed.
      const [count, rows] = await this.order.update(values, {
        where: { order_id: id, status: currentStatus },
        returning: true,
        transaction,
      });
      if (count === 0) {
        throw new ConflictException(
          'This booking was changed by someone else. Refresh and try again.',
        );
      }
      return rows[0];
    };

    return slotChanged
      ? this.withCustomerLock(order.customer_id, apply)
      : apply();
  }

  async remove(id: string, user: AuthUser): Promise<Order> {
    const order = await this.findOne(id, user);
    await order.destroy();
    return order;
  }

  private withCustomerLock<T>(
    customerId: string,
    work: (transaction: Transaction) => Promise<T>,
  ): Promise<T> {
    const sequelize = this.order.sequelize;
    return sequelize.transaction(async (transaction) => {
      await sequelize.query('SELECT pg_advisory_xact_lock(hashtext(:key))', {
        replacements: { key: `orders:${customerId}` },
        transaction,
      });
      return work(transaction);
    });
  }

  private async assertNoDuplicate(
    slot: BookingSlot,
    exceptOrderId: string | undefined,
    transaction?: Transaction,
  ) {
    const duplicate = await this.order.findOne({
      where: {
        customer_id: slot.customer_id,
        event_type: slot.event_type,
        event_date: slot.event_date,
        status: { [Op.in]: ACTIVE_STATUSES },
        ...(exceptOrderId ? { order_id: { [Op.ne]: exceptOrderId } } : {}),
        [Op.and]: [where(fn('lower', col('venue')), slot.venue.toLowerCase())],
      },
      attributes: ['order_id'],
      transaction,
    });
    if (duplicate) {
      throw new ConflictException(
        'You already have an active booking for this occasion, date and venue.',
      );
    }
  }
}
