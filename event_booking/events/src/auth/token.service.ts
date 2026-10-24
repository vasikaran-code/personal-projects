import { Injectable, Logger } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';

const TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;
const DEV_SECRET = 'event-booking-dev-secret-change-me';

interface TokenPayload {
  sub: string;
  exp: number;
}

const resolveSecret = () => {
  const secret = process.env.AUTH_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_SECRET must be set in production');
  }
  new Logger('Auth').warn(
    'AUTH_SECRET is not set; using an insecure development secret.',
  );
  return DEV_SECRET;
};

// Minimal signed bearer token: base64url(payload).base64url(HMAC-SHA256).
@Injectable()
export class TokenService {
  private readonly secret = resolveSecret();

  sign(customerId: string, now = Date.now()) {
    const payload: TokenPayload = {
      sub: customerId,
      exp: Math.floor(now / 1000) + TOKEN_TTL_SECONDS,
    };
    const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
    return `${encoded}.${this.signature(encoded)}`;
  }

  // Returns the customer id, or null for a malformed, tampered or expired token.
  verify(token: string, now = Date.now()): string | null {
    const [encoded, signature, extra] = (token ?? '').split('.');
    if (!encoded || !signature || extra !== undefined) return null;

    const expected = Buffer.from(this.signature(encoded));
    const given = Buffer.from(signature);
    if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
      return null;
    }

    try {
      const payload = JSON.parse(
        Buffer.from(encoded, 'base64url').toString('utf8'),
      ) as TokenPayload;
      if (typeof payload.sub !== 'string' || typeof payload.exp !== 'number') {
        return null;
      }
      return payload.exp * 1000 > now ? payload.sub : null;
    } catch {
      return null;
    }
  }

  private signature(encoded: string) {
    return createHmac('sha256', this.secret)
      .update(encoded)
      .digest('base64url');
  }
}
