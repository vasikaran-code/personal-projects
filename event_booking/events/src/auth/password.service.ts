import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

const PREFIX = 'scrypt';
const KEY_LENGTH = 64;

@Injectable()
export class PasswordService {
  isHashed(stored: string) {
    return typeof stored === 'string' && stored.startsWith(`${PREFIX}$`);
  }

  async hash(password: string) {
    const salt = randomBytes(16);
    const key = await scryptAsync(password, salt, KEY_LENGTH);
    return `${PREFIX}$${salt.toString('hex')}$${key.toString('hex')}`;
  }

  // Accounts created before hashing was added still hold plaintext passwords;
  // those are compared in constant time and rehashed by the caller after login.
  async verify(password: string, stored: string) {
    if (typeof stored !== 'string' || !stored) return false;
    if (!this.isHashed(stored)) {
      return safeEqual(Buffer.from(password), Buffer.from(stored));
    }
    const [, saltHex, keyHex] = stored.split('$');
    if (!saltHex || !keyHex) return false;
    const key = await scryptAsync(
      password,
      Buffer.from(saltHex, 'hex'),
      KEY_LENGTH,
    );
    return safeEqual(key, Buffer.from(keyHex, 'hex'));
  }
}

const safeEqual = (a: Buffer, b: Buffer) =>
  a.length === b.length && timingSafeEqual(a, b);
