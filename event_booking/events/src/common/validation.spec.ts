import { BadRequestException } from '@nestjs/common';
import { CreateCustomerDto } from '../customer/dto/create-customer.dto';
import { UpdateCustomerDto } from '../customer/dto/update-customer.dto';
import { CreateOrderDto } from '../orders/dto/create-order.dto';
import { UpdateOrderDto } from '../orders/dto/update-order.dto';
import { createValidationPipe } from './validation';

const pipe = createValidationPipe();
const run = (metatype: any, value: unknown) =>
  pipe.transform(value, { type: 'body', metatype });

const fieldErrors = async (metatype: any, value: unknown) => {
  try {
    await run(metatype, value);
  } catch (e) {
    expect(e).toBeInstanceOf(BadRequestException);
    return (e as BadRequestException).getResponse()['errors'] as Record<
      string,
      string[]
    >;
  }
  throw new Error('expected validation to fail');
};

const validOrder = {
  name: 'Anbu',
  event_type: 'Birthday',
  event_date: '2030-05-01',
  level: 'GOLD',
  venue: 'Madurai',
  contact: '9876543210',
  alternative_contact: '',
  mail_id: 'anbu@example.com',
};

describe('global validation pipe', () => {
  describe('CreateOrderDto', () => {
    it('accepts the payload the booking form sends', async () => {
      const result = await run(CreateOrderDto, {
        ...validOrder,
        customer_id: 'cust_1',
      });
      expect(result).toBeInstanceOf(CreateOrderDto);
      expect(result.alternative_contact).toBe('');
    });

    it('reports every missing required field', async () => {
      const errors = await fieldErrors(CreateOrderDto, {});
      expect(Object.keys(errors).sort()).toEqual(
        [
          'contact',
          'event_date',
          'event_type',
          'level',
          'mail_id',
          'name',
          'venue',
        ].sort(),
      );
    });

    it('rejects whitespace-only text and trims valid text', async () => {
      const errors = await fieldErrors(CreateOrderDto, {
        ...validOrder,
        name: '   ',
        venue: '\t',
      });
      expect(errors.name).toBeDefined();
      expect(errors.venue).toBeDefined();

      const ok = await run(CreateOrderDto, {
        ...validOrder,
        name: '  Anbu  ',
        venue: ' Madurai ',
      });
      expect(ok.name).toBe('Anbu');
      expect(ok.venue).toBe('Madurai');
    });

    it('rejects invalid dates, enums, phones and emails', async () => {
      const errors = await fieldErrors(CreateOrderDto, {
        ...validOrder,
        event_date: '2030-02-30',
        event_type: 'Party',
        level: 'gold',
        contact: '98765',
        alternative_contact: 'abc',
        mail_id: 'not-an-email',
      });
      expect(Object.keys(errors).sort()).toEqual(
        [
          'alternative_contact',
          'contact',
          'event_date',
          'event_type',
          'level',
          'mail_id',
        ].sort(),
      );
    });

    it('rejects wrong types and unexpected properties', async () => {
      const errors = await fieldErrors(CreateOrderDto, {
        ...validOrder,
        name: 42,
        contact: 9876543210,
        status: 'confirmed',
        order_id: 'ord_mine',
      });
      expect(errors.name).toBeDefined();
      expect(errors.contact).toBeDefined();
      expect(errors.status).toEqual(['property status should not exist']);
      expect(errors.order_id).toBeDefined();
    });
  });

  describe('UpdateOrderDto', () => {
    it('accepts a status-only partial update', async () => {
      await expect(
        run(UpdateOrderDto, { status: 'Rejected' }),
      ).resolves.toEqual({ status: 'Rejected' });
    });

    it('validates fields that are present', async () => {
      const errors = await fieldErrors(UpdateOrderDto, {
        status: 'approved',
        event_date: 'tomorrow',
      });
      expect(Object.keys(errors).sort()).toEqual(['event_date', 'status']);
    });

    it('does not allow reassigning the owner', async () => {
      const errors = await fieldErrors(UpdateOrderDto, {
        customer_id: 'cust_other',
      });
      expect(errors.customer_id).toBeDefined();
    });
  });

  describe('customer DTOs', () => {
    it('rejects self-assigned ids and admin rights on registration', async () => {
      const errors = await fieldErrors(CreateCustomerDto, {
        cust_name: 'Ann',
        email: 'ann@example.com',
        password: 'secret',
        customer_id: 'cust_mine',
        isAdmin: true,
      });
      expect(Object.keys(errors).sort()).toEqual(['customer_id', 'isAdmin']);
    });

    it('normalizes email and validates password length', async () => {
      const ok = await run(CreateCustomerDto, {
        cust_name: ' Ann ',
        email: ' Ann@Example.COM ',
        password: 'secret',
      });
      expect(ok).toMatchObject({ cust_name: 'Ann', email: 'ann@example.com' });

      const errors = await fieldErrors(CreateCustomerDto, {
        cust_name: 'Ann',
        email: 'ann',
        password: 'abc',
      });
      expect(Object.keys(errors).sort()).toEqual(['email', 'password']);
    });

    it('does not allow granting admin rights through an update', async () => {
      const errors = await fieldErrors(UpdateCustomerDto, { isAdmin: true });
      expect(errors.isAdmin).toBeDefined();
    });
  });
});
