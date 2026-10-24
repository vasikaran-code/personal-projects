import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ADMIN_ONLY, IS_PUBLIC } from './auth.decorators';
import { AuthGuard } from './auth.guard';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';

describe('TokenService', () => {
  const tokens = new TokenService();

  it('round-trips a customer id', () => {
    expect(tokens.verify(tokens.sign('cust_1'))).toBe('cust_1');
  });

  it('rejects tampered, malformed and expired tokens', () => {
    const token = tokens.sign('cust_1');
    const [payload, signature] = token.split('.');
    const forged = Buffer.from(
      JSON.stringify({ sub: 'cust_admin', exp: 9999999999 }),
    ).toString('base64url');

    expect(tokens.verify(`${forged}.${signature}`)).toBeNull();
    expect(tokens.verify(`${payload}.x${signature}`)).toBeNull();
    expect(tokens.verify('garbage')).toBeNull();
    expect(tokens.verify(undefined as any)).toBeNull();
    expect(
      tokens.verify(token, Date.now() + 8 * 24 * 60 * 60 * 1000),
    ).toBeNull();
  });
});

describe('PasswordService', () => {
  const passwords = new PasswordService();

  it('hashes with a random salt and verifies', async () => {
    const a = await passwords.hash('secret');
    const b = await passwords.hash('secret');
    expect(a).not.toBe(b);
    expect(await passwords.verify('secret', a)).toBe(true);
    expect(await passwords.verify('Secret', a)).toBe(false);
  });

  it('still verifies legacy plaintext passwords', async () => {
    expect(await passwords.verify('secret', 'secret')).toBe(true);
    expect(await passwords.verify('secre', 'secret')).toBe(false);
    expect(await passwords.verify('secret', null as any)).toBe(false);
  });
});

describe('AuthGuard', () => {
  const tokens = new TokenService();
  const customers = { findOne: jest.fn() };
  const metadata: Record<string, boolean> = {};
  const reflector = {
    getAllAndOverride: (key: string) => metadata[key],
  } as unknown as Reflector;
  const guard = new AuthGuard(reflector, tokens, customers as any);

  const context = (authorization?: string) => {
    const request: any = { headers: { authorization } };
    return {
      request,
      ctx: {
        getHandler: () => null,
        getClass: () => null,
        switchToHttp: () => ({ getRequest: () => request }),
      } as any,
    };
  };

  beforeEach(() => {
    delete metadata[IS_PUBLIC];
    delete metadata[ADMIN_ONLY];
    customers.findOne.mockReset();
  });

  it('allows public routes without a token', async () => {
    metadata[IS_PUBLIC] = true;
    await expect(guard.canActivate(context().ctx)).resolves.toBe(true);
  });

  it('requires a valid bearer token', async () => {
    await expect(guard.canActivate(context().ctx)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    await expect(
      guard.canActivate(context('Bearer nope').ctx),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    await expect(
      guard.canActivate(context(tokens.sign('cust_1')).ctx),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects tokens for accounts that no longer exist', async () => {
    customers.findOne.mockResolvedValue(null);
    await expect(
      guard.canActivate(context(`Bearer ${tokens.sign('cust_1')}`).ctx),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('attaches the caller with admin rights read from the database', async () => {
    customers.findOne.mockResolvedValue({
      customer_id: 'cust_1',
      isAdmin: false,
    });
    const { ctx, request } = context(`Bearer ${tokens.sign('cust_1')}`);
    await expect(guard.canActivate(ctx)).resolves.toBe(true);
    expect(request.user).toEqual({ customer_id: 'cust_1', isAdmin: false });
  });

  it('blocks non-admins from admin-only routes', async () => {
    metadata[ADMIN_ONLY] = true;
    customers.findOne.mockResolvedValue({
      customer_id: 'cust_1',
      isAdmin: false,
    });
    await expect(
      guard.canActivate(context(`Bearer ${tokens.sign('cust_1')}`).ctx),
    ).rejects.toBeInstanceOf(ForbiddenException);

    customers.findOne.mockResolvedValue({
      customer_id: 'cust_admin',
      isAdmin: true,
    });
    await expect(
      guard.canActivate(context(`Bearer ${tokens.sign('cust_admin')}`).ctx),
    ).resolves.toBe(true);
  });
});
