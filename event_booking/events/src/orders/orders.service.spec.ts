import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Test } from '@nestjs/testing';
import { AuthUser } from '../auth/auth.decorators';
import { Order } from './models/order.model';
import { todayISO } from './order.rules';
import { OrdersService } from './orders.service';

const daysFromToday = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return todayISO(d);
};

const customer: AuthUser = { customer_id: 'cust_owner', isAdmin: false };
const otherCustomer: AuthUser = { customer_id: 'cust_other', isAdmin: false };
const admin: AuthUser = { customer_id: 'cust_admin', isAdmin: true };

const bookingInput = () => ({
  name: 'Anbu',
  event_type: 'Birthday',
  event_date: daysFromToday(30),
  level: 'GOLD',
  venue: 'Madurai',
  contact: '9876543210',
  alternative_contact: '',
  mail_id: 'anbu@example.com',
});

const storedOrder = (overrides: Partial<Order> = {}) =>
  ({
    order_id: 'ord_1',
    customer_id: customer.customer_id,
    status: 'pending',
    ...bookingInput(),
    ...overrides,
  }) as Order;

describe('OrdersService', () => {
  let service: OrdersService;
  const model = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    sequelize: {
      transaction: jest.fn((work: (t: unknown) => unknown) => work('tx')),
      query: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: getModelToken(Order), useValue: model },
      ],
    }).compile();
    service = moduleRef.get(OrdersService);
  });

  describe('create', () => {
    it('creates a pending booking owned by the signed-in customer', async () => {
      model.findOne.mockResolvedValue(null);
      model.create.mockImplementation(async (data) => data);

      const result = await service.create(
        { ...bookingInput(), customer_id: customer.customer_id },
        customer,
      );

      expect(result).toMatchObject({
        status: 'pending',
        customer_id: 'cust_owner',
      });
      expect(result.order_id).toMatch(/^ord_[0-9a-f]{16}$/);
      expect(model.sequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('pg_advisory_xact_lock'),
        expect.objectContaining({
          replacements: { key: 'orders:cust_owner' },
          transaction: 'tx',
        }),
      );
      expect(model.create).toHaveBeenCalledWith(expect.anything(), {
        transaction: 'tx',
      });
    });

    it('rejects booking on behalf of another customer', async () => {
      await expect(
        service.create(
          { ...bookingInput(), customer_id: otherCustomer.customer_id },
          customer,
        ),
      ).rejects.toBeInstanceOf(ForbiddenException);
      expect(model.create).not.toHaveBeenCalled();
    });

    it('rejects past event dates but allows today', async () => {
      await expect(
        service.create(
          { ...bookingInput(), event_date: daysFromToday(-1) },
          customer,
        ),
      ).rejects.toBeInstanceOf(BadRequestException);

      model.findOne.mockResolvedValue(null);
      model.create.mockImplementation(async (data) => data);
      await expect(
        service.create(
          { ...bookingInput(), event_date: daysFromToday(0) },
          customer,
        ),
      ).resolves.toBeDefined();
    });

    it('rejects a duplicate active booking for the same occasion, date and venue', async () => {
      model.findOne.mockResolvedValue({ order_id: 'ord_existing' });
      await expect(
        service.create(bookingInput(), customer),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(model.create).not.toHaveBeenCalled();
    });
  });

  describe('read access', () => {
    it('limits customers to their own bookings', async () => {
      model.findAll.mockResolvedValue([]);
      await service.findAll(customer);
      expect(model.findAll).toHaveBeenCalledWith({
        where: { customer_id: 'cust_owner' },
      });

      await service.findAll(admin);
      expect(model.findAll).toHaveBeenLastCalledWith();
    });

    it('returns 404 for a missing booking and 403 for someone else’s', async () => {
      model.findOne.mockResolvedValue(null);
      await expect(service.findOne('ord_x', customer)).rejects.toBeInstanceOf(
        NotFoundException,
      );

      model.findOne.mockResolvedValue(storedOrder());
      await expect(
        service.findOne('ord_1', otherCustomer),
      ).rejects.toBeInstanceOf(ForbiddenException);
      await expect(service.findOne('ord_1', admin)).resolves.toBeDefined();
    });
  });

  describe('update', () => {
    const succeed = () =>
      model.update.mockImplementation(async (values) => [
        1,
        [{ ...storedOrder(), ...values }],
      ]);

    it('lets an admin confirm a pending booking using a conditional update', async () => {
      model.findOne.mockResolvedValue(storedOrder());
      succeed();

      const result = await service.update(
        'ord_1',
        { status: 'confirmed' },
        admin,
      );

      expect(result.status).toBe('confirmed');
      expect(model.update).toHaveBeenCalledWith(
        { status: 'confirmed' },
        expect.objectContaining({
          where: { order_id: 'ord_1', status: 'pending' },
          returning: true,
        }),
      );
    });

    it('lets the owner cancel a pending booking', async () => {
      model.findOne.mockResolvedValue(storedOrder());
      succeed();
      await expect(
        service.update('ord_1', { status: 'cancelled' }, customer),
      ).resolves.toMatchObject({
        status: 'cancelled',
      });
    });

    it('forbids customers from confirming or rejecting', async () => {
      model.findOne.mockResolvedValue(storedOrder());
      await expect(
        service.update('ord_1', { status: 'confirmed' }, customer),
      ).rejects.toBeInstanceOf(ForbiddenException);
      await expect(
        service.update('ord_1', { status: 'Rejected' }, customer),
      ).rejects.toBeInstanceOf(ForbiddenException);
      expect(model.update).not.toHaveBeenCalled();
    });

    it('forbids changes to another customer’s booking', async () => {
      model.findOne.mockResolvedValue(storedOrder());
      await expect(
        service.update('ord_1', { status: 'cancelled' }, otherCustomer),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('rejects invalid transitions from final states', async () => {
      model.findOne.mockResolvedValue(storedOrder({ status: 'Rejected' }));
      await expect(
        service.update('ord_1', { status: 'confirmed' }, admin),
      ).rejects.toBeInstanceOf(ConflictException);
      model.findOne.mockResolvedValue(storedOrder({ status: 'cancelled' }));
      await expect(
        service.update('ord_1', { status: 'cancelled' }, customer),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('refuses to confirm a booking whose date has passed', async () => {
      model.findOne.mockResolvedValue(
        storedOrder({ event_date: daysFromToday(-3) }),
      );
      await expect(
        service.update('ord_1', { status: 'confirmed' }, admin),
      ).rejects.toThrow('A booking for a past date cannot be confirmed.');
      succeed();
      await expect(
        service.update('ord_1', { status: 'Rejected' }, admin),
      ).resolves.toBeDefined();
    });

    it('allows editing details only while pending and never to a past date', async () => {
      model.findOne.mockResolvedValue(storedOrder({ status: 'confirmed' }));
      await expect(
        service.update('ord_1', { venue: 'Chennai' }, customer),
      ).rejects.toThrow('Only pending bookings can be edited.');

      model.findOne.mockResolvedValue(storedOrder());
      await expect(
        service.update('ord_1', { event_date: daysFromToday(-1) }, customer),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('checks for duplicates under the customer lock when the date or venue changes', async () => {
      model.findOne
        .mockResolvedValueOnce(storedOrder())
        .mockResolvedValueOnce({ order_id: 'ord_2' });
      await expect(
        service.update('ord_1', { venue: 'Chennai' }, customer),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(model.sequelize.query).toHaveBeenCalled();
      expect(model.update).not.toHaveBeenCalled();
    });

    it('returns 409 when the booking changed concurrently', async () => {
      model.findOne.mockResolvedValue(storedOrder());
      model.update.mockResolvedValue([0, []]);
      await expect(
        service.update('ord_1', { status: 'confirmed' }, admin),
      ).rejects.toThrow(
        'This booking was changed by someone else. Refresh and try again.',
      );
    });

    it('rejects an empty update', async () => {
      model.findOne.mockResolvedValue(storedOrder());
      await expect(
        service.update('ord_1', {}, customer),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });
});
