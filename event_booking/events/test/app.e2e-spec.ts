import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import * as request from 'supertest';

// Runs the real HTTP stack against a dedicated PostgreSQL database, which is
// TRUNCATED before the run. Never point this at the development database:
//   E2E_DB_NAME=events_booking_test npm run test:e2e
const dbName = process.env.E2E_DB_NAME;
const enabled = !!dbName && dbName !== 'postgres';
if (!enabled) {
  console.warn(
    'Skipping e2e tests: set E2E_DB_NAME to a dedicated test database.',
  );
}

const daysFromToday = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const booking = (overrides: Record<string, unknown> = {}) => ({
  name: 'Anbu',
  event_type: 'Birthday',
  event_date: daysFromToday(30),
  level: 'GOLD',
  venue: 'Madurai',
  contact: '9876543210',
  alternative_contact: '',
  mail_id: 'anbu@example.com',
  ...overrides,
});

(enabled ? describe : describe.skip)('Event booking API (e2e)', () => {
  let app: INestApplication;
  let db: Sequelize;
  let http: ReturnType<typeof request>;

  let customerToken: string;
  let customerId: string;
  let otherToken: string;
  let adminToken: string;

  const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

  const login = async (email: string, password: string) => {
    const res = await http
      .post('/customer/login')
      .send({ email, password })
      .expect(200);
    return res.body as {
      access_token: string;
      customer: { customer_id: string };
    };
  };

  const register = async (email: string) => {
    await http
      .post('/customer')
      .send({ cust_name: 'Tester', email, password: 'secret' })
      .expect(201);
    return login(email, 'secret');
  };

  const insertOrder = (values: Record<string, unknown>) =>
    db.query(
      `INSERT INTO orders (order_id, name, event_type, event_date, level, venue, contact, alternative_contact,
         mail_id, status, customer_id, "createdAt", "updatedAt")
       VALUES (:order_id, 'Seed', 'Marriage', :event_date, 'GOLD', 'Madurai', '9876543210', '',
         'seed@example.com', :status, :customer_id, now(), now())`,
      { replacements: values },
    );

  beforeAll(async () => {
    process.env.DB_NAME = dbName;
    // Imported after DB_NAME is set because the module reads it at load time.
    const { AppModule } = await import('../src/app.module');
    const { configureApp } = await import('../src/app.setup');

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = configureApp(moduleRef.createNestApplication());
    await app.init();
    http = request(app.getHttpServer());
    db = app.get(Sequelize);

    await db.query('TRUNCATE orders, customer CASCADE');

    // Seed an admin and a legacy account with a plaintext password,
    // as existing accounts were stored before hashing.
    await db.query(
      `INSERT INTO customer (customer_id, cust_name, email, password, "isAdmin", "createdAt", "updatedAt") VALUES
       ('cust_admin', 'Admin', 'admin@example.com', 'adminpw', true, now(), now()),
       ('cust_legacy', 'Legacy', 'legacy@example.com', 'oldpw', false, now(), now())`,
    );

    const customer = await register('owner@example.com');
    customerToken = customer.access_token;
    customerId = customer.customer.customer_id;
    otherToken = (await register('other@example.com')).access_token;
    adminToken = (await login('admin@example.com', 'adminpw')).access_token;
  });

  afterAll(async () => {
    await app?.close();
  });

  describe('accounts and authentication', () => {
    it('keeps the public health route open', () =>
      http.get('/').expect(200, 'Hello World!'));

    it('never returns passwords and rejects self-granted admin rights', async () => {
      const created = await http
        .post('/customer')
        .send({
          cust_name: 'New',
          email: 'new@example.com',
          password: 'secret',
        })
        .expect(201);
      expect(created.body).not.toHaveProperty('password');
      expect(created.body.isAdmin).toBe(false);

      const escalated = await http
        .post('/customer')
        .send({
          cust_name: 'Evil',
          email: 'evil@example.com',
          password: 'secret',
          isAdmin: true,
        })
        .expect(400);
      expect(escalated.body.errors).toHaveProperty('isAdmin');

      const list = await http
        .get('/customer')
        .set(auth(adminToken))
        .expect(200);
      expect(list.body.length).toBeGreaterThan(0);
      list.body.forEach((c: object) =>
        expect(c).not.toHaveProperty('password'),
      );
    });

    it('rejects duplicate emails regardless of case', () =>
      http
        .post('/customer')
        .send({
          cust_name: 'Dup',
          email: 'OWNER@example.com',
          password: 'secret',
        })
        .expect(409));

    it('logs in a legacy plaintext account and upgrades it to a hash', async () => {
      await login('legacy@example.com', 'oldpw');
      const [[row]] = (await db.query(
        `SELECT password FROM customer WHERE customer_id = 'cust_legacy'`,
      )) as any;
      expect(row.password).toMatch(/^scrypt\$/);
      await login('legacy@example.com', 'oldpw');
    });

    it('returns 401 for wrong credentials and missing or forged tokens', async () => {
      await http
        .post('/customer/login')
        .send({ email: 'owner@example.com', password: 'wrong' })
        .expect(401);
      await http.get('/orders').expect(401);
      await http
        .get('/orders')
        .set(auth(`${customerToken}x`))
        .expect(401);
    });

    it('limits customer records to their owner and admins', async () => {
      await http.get('/customer').set(auth(customerToken)).expect(403);
      await http
        .get(`/customer/${customerId}`)
        .set(auth(customerToken))
        .expect(200);
      await http
        .get(`/customer/${customerId}`)
        .set(auth(otherToken))
        .expect(403);
      await http
        .get(`/customer/${customerId}`)
        .set(auth(adminToken))
        .expect(200);
    });
  });

  describe('booking validation', () => {
    it('returns field-level errors for missing and malformed fields', async () => {
      const res = await http
        .post('/orders')
        .set(auth(customerToken))
        .send({})
        .expect(400);
      expect(res.body).toMatchObject({ statusCode: 400, error: 'Bad Request' });
      expect(Object.keys(res.body.errors)).toEqual(
        expect.arrayContaining([
          'name',
          'event_type',
          'event_date',
          'level',
          'venue',
          'contact',
          'mail_id',
        ]),
      );

      const bad = await http
        .post('/orders')
        .set(auth(customerToken))
        .send(
          booking({
            event_date: '2030-02-30',
            contact: '123',
            status: 'confirmed',
          }),
        )
        .expect(400);
      expect(Object.keys(bad.body.errors).sort()).toEqual([
        'contact',
        'event_date',
        'status',
      ]);
    });

    it('rejects past dates and booking for another customer', async () => {
      await http
        .post('/orders')
        .set(auth(customerToken))
        .send(booking({ event_date: daysFromToday(-1) }))
        .expect(400);
      await http
        .post('/orders')
        .set(auth(customerToken))
        .send(booking({ customer_id: 'cust_admin' }))
        .expect(403);
    });

    it('rejects malformed JSON and invalid identifiers', async () => {
      await http
        .post('/orders')
        .set(auth(customerToken))
        .set('Content-Type', 'application/json')
        .send('{"name":')
        .expect(400);
      await http
        .get('/orders/not%20an%20id')
        .set(auth(customerToken))
        .expect(400);
      await http
        .get('/orders/ord_missing')
        .set(auth(customerToken))
        .expect(404);
    });
  });

  describe('booking lifecycle', () => {
    let orderId: string;

    it('creates a pending booking owned by the caller, as the frontend sends it', async () => {
      const res = await http
        .post('/orders')
        .set(auth(customerToken))
        .send(booking({ customer_id: customerId, venue: '  Madurai  ' }))
        .expect(201);
      expect(res.body).toMatchObject({
        status: 'pending',
        customer_id: customerId,
        venue: 'Madurai',
      });
      orderId = res.body.order_id;
    });

    it('hides other customers’ bookings', async () => {
      await http.get(`/orders/${orderId}`).set(auth(otherToken)).expect(403);
      const mine = await http.get('/orders').set(auth(otherToken)).expect(200);
      expect(mine.body).toEqual([]);
      const all = await http.get('/orders').set(auth(adminToken)).expect(200);
      expect(all.body.map((o: { order_id: string }) => o.order_id)).toContain(
        orderId,
      );
    });

    it('stops customers from deciding or modifying others’ bookings', async () => {
      await http
        .patch(`/orders/${orderId}`)
        .set(auth(customerToken))
        .send({ status: 'confirmed' })
        .expect(403);
      await http
        .patch(`/orders/${orderId}`)
        .set(auth(otherToken))
        .send({ status: 'cancelled' })
        .expect(403);
      await http
        .patch(`/orders/${orderId}`)
        .set(auth(customerToken))
        .send({ customer_id: 'cust_admin' })
        .expect(400);
      await http
        .delete(`/orders/${orderId}`)
        .set(auth(customerToken))
        .expect(403);
    });

    it('lets an admin confirm exactly once when decisions race', async () => {
      const results = await Promise.all([
        http
          .patch(`/orders/${orderId}`)
          .set(auth(adminToken))
          .send({ status: 'confirmed' }),
        http
          .patch(`/orders/${orderId}`)
          .set(auth(adminToken))
          .send({ status: 'Rejected' }),
      ]);
      expect(results.map((r) => r.status).sort()).toEqual([200, 409]);
    });

    it('rejects transitions out of a final or decided state', async () => {
      const id = 'ord_final';
      await insertOrder({
        order_id: id,
        event_date: daysFromToday(10),
        status: 'cancelled',
        customer_id: customerId,
      });
      await http
        .patch(`/orders/${id}`)
        .set(auth(adminToken))
        .send({ status: 'confirmed' })
        .expect(409);
      await http
        .patch(`/orders/${id}`)
        .set(auth(customerToken))
        .send({ venue: 'Chennai' })
        .expect(409);
    });

    it('does not confirm a booking whose date has passed', async () => {
      const id = 'ord_past';
      await insertOrder({
        order_id: id,
        event_date: daysFromToday(-5),
        status: 'pending',
        customer_id: customerId,
      });
      const res = await http
        .patch(`/orders/${id}`)
        .set(auth(adminToken))
        .send({ status: 'confirmed' })
        .expect(409);
      expect(res.body.message).toBe(
        'A booking for a past date cannot be confirmed.',
      );
      await http
        .patch(`/orders/${id}`)
        .set(auth(customerToken))
        .send({ status: 'cancelled' })
        .expect(200);
    });
  });

  describe('duplicate submissions', () => {
    it('accepts only one of several simultaneous identical requests', async () => {
      const payload = booking({
        event_type: 'Engagement',
        event_date: daysFromToday(60),
        customer_id: customerId,
      });
      const results = await Promise.all(
        Array.from({ length: 6 }, () =>
          http.post('/orders').set(auth(customerToken)).send(payload),
        ),
      );
      const codes = results.map((r) => r.status).sort();
      expect(codes).toEqual([201, 409, 409, 409, 409, 409]);

      const [[{ count }]] = (await db.query(
        `SELECT count(*)::int AS count FROM orders WHERE customer_id = :id AND event_type = 'Engagement'`,
        { replacements: { id: customerId } },
      )) as any;
      expect(count).toBe(1);
    });

    it('allows rebooking the same slot once the earlier request is cancelled', async () => {
      const payload = booking({
        event_type: 'Reception',
        event_date: daysFromToday(90),
      });
      const first = await http
        .post('/orders')
        .set(auth(customerToken))
        .send(payload)
        .expect(201);
      await http
        .post('/orders')
        .set(auth(customerToken))
        .send({ ...payload, venue: 'MADURAI' })
        .expect(409);
      await http
        .patch(`/orders/${first.body.order_id}`)
        .set(auth(customerToken))
        .send({ status: 'cancelled' })
        .expect(200);
      await http
        .post('/orders')
        .set(auth(customerToken))
        .send(payload)
        .expect(201);
    });
  });
});
