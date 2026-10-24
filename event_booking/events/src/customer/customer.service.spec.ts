import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Test } from '@nestjs/testing';
import { PasswordService } from '../auth/password.service';
import { TokenService } from '../auth/token.service';
import { Order } from '../orders/models/order.model';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';

describe('CustomerService', () => {
  let service: CustomerService;
  let passwords: PasswordService;
  let tokens: TokenService;

  const customerModel = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };
  const orderModel = { count: jest.fn() };

  const self = { customer_id: 'cust_1', isAdmin: false };
  const admin = { customer_id: 'cust_admin', isAdmin: true };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        CustomerService,
        PasswordService,
        TokenService,
        { provide: getModelToken(Customer), useValue: customerModel },
        { provide: getModelToken(Order), useValue: orderModel },
      ],
    }).compile();
    service = moduleRef.get(CustomerService);
    passwords = moduleRef.get(PasswordService);
    tokens = moduleRef.get(TokenService);
  });

  describe('create', () => {
    it('stores a hashed password with a server-generated id and no admin rights', async () => {
      customerModel.findOne.mockResolvedValue(null);
      customerModel.create.mockImplementation(async (data) => data);

      const created = await service.create({
        cust_name: 'Ann',
        email: 'ann@example.com',
        password: 'secret',
      });

      expect(created.customer_id).toMatch(/^cust_[0-9a-f]{10}$/);
      expect(created.isAdmin).toBe(false);
      expect(created.password).not.toBe('secret');
      expect(await passwords.verify('secret', created.password)).toBe(true);
    });

    it('rejects an email that is already registered', async () => {
      customerModel.findOne.mockResolvedValue({ customer_id: 'cust_9' });
      await expect(
        service.create({
          cust_name: 'Ann',
          email: 'ann@example.com',
          password: 'secret',
        }),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(customerModel.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('returns a token for valid credentials', async () => {
      const stored = {
        customer_id: 'cust_1',
        password: await passwords.hash('secret'),
        save: jest.fn(),
      };
      customerModel.findOne.mockResolvedValue(stored);

      const result = await service.login({
        email: 'ann@example.com',
        password: 'secret',
      });

      expect(tokens.verify(result.access_token)).toBe('cust_1');
      expect(stored.save).not.toHaveBeenCalled();
    });

    it('upgrades a legacy plaintext password after a successful login', async () => {
      const stored = {
        customer_id: 'cust_1',
        password: 'secret',
        save: jest.fn(),
      };
      customerModel.findOne.mockResolvedValue(stored);

      await service.login({ email: 'ann@example.com', password: 'secret' });

      expect(passwords.isHashed(stored.password)).toBe(true);
      expect(stored.save).toHaveBeenCalled();
    });

    it('gives the same error for an unknown email and a wrong password', async () => {
      customerModel.findOne.mockResolvedValue(null);
      await expect(
        service.login({ email: 'x@example.com', password: 'secret' }),
      ).rejects.toThrow(
        new UnauthorizedException('Incorrect email or password'),
      );
      customerModel.findOne.mockResolvedValue({
        customer_id: 'cust_1',
        password: 'secret',
        save: jest.fn(),
      });
      await expect(
        service.login({ email: 'ann@example.com', password: 'wrong' }),
      ).rejects.toThrow(
        new UnauthorizedException('Incorrect email or password'),
      );
    });
  });

  describe('access control', () => {
    it('lets customers read only their own account', async () => {
      await expect(service.findOne('cust_other', self)).rejects.toBeInstanceOf(
        ForbiddenException,
      );

      customerModel.findOne.mockResolvedValue(null);
      await expect(service.findOne('cust_1', self)).rejects.toBeInstanceOf(
        NotFoundException,
      );

      customerModel.findOne.mockResolvedValue({ customer_id: 'cust_other' });
      await expect(service.findOne('cust_other', admin)).resolves.toBeDefined();
    });

    it('will not delete an account that has bookings', async () => {
      customerModel.findOne.mockResolvedValue({
        customer_id: 'cust_1',
        destroy: jest.fn(),
      });
      orderModel.count.mockResolvedValue(2);
      await expect(service.remove('cust_1', self)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });
  });

  it('never serializes the password', () => {
    const values = {
      customer_id: 'cust_1',
      cust_name: 'Ann',
      email: 'a@b.co',
      password: 'hash',
    };
    const json = Customer.prototype.toJSON.call({ get: () => values });
    expect(json).toEqual({
      customer_id: 'cust_1',
      cust_name: 'Ann',
      email: 'a@b.co',
    });
  });
});
