import {
  checkTransition,
  isCalendarDate,
  isPastDate,
  normalizeStatus,
  ORDER_STATUS,
  todayISO,
} from './order.rules';

const admin = { isAdmin: true, isOwner: false };
const owner = { isAdmin: false, isOwner: true };
const stranger = { isAdmin: false, isOwner: false };

describe('order rules', () => {
  describe('checkTransition', () => {
    it('lets admins confirm or reject pending bookings', () => {
      expect(checkTransition('pending', ORDER_STATUS.CONFIRMED, admin)).toBe(
        'ok',
      );
      expect(checkTransition('pending', ORDER_STATUS.REJECTED, admin)).toBe(
        'ok',
      );
    });

    it('lets owners cancel only pending bookings', () => {
      expect(checkTransition('pending', ORDER_STATUS.CANCELLED, owner)).toBe(
        'ok',
      );
      expect(checkTransition('confirmed', ORDER_STATUS.CANCELLED, owner)).toBe(
        'forbidden',
      );
      expect(checkTransition('confirmed', ORDER_STATUS.CANCELLED, admin)).toBe(
        'ok',
      );
    });

    it('does not let owners decide their own booking', () => {
      expect(checkTransition('pending', ORDER_STATUS.CONFIRMED, owner)).toBe(
        'forbidden',
      );
      expect(checkTransition('pending', ORDER_STATUS.REJECTED, owner)).toBe(
        'forbidden',
      );
      expect(checkTransition('pending', ORDER_STATUS.CANCELLED, stranger)).toBe(
        'forbidden',
      );
    });

    it('treats rejected and cancelled as final, and same-state changes as invalid', () => {
      expect(checkTransition('Rejected', ORDER_STATUS.CONFIRMED, admin)).toBe(
        'invalid',
      );
      expect(checkTransition('cancelled', ORDER_STATUS.PENDING, admin)).toBe(
        'invalid',
      );
      expect(checkTransition('confirmed', ORDER_STATUS.PENDING, admin)).toBe(
        'invalid',
      );
      expect(checkTransition('pending', ORDER_STATUS.PENDING, admin)).toBe(
        'invalid',
      );
      expect(checkTransition('confirmed', ORDER_STATUS.CONFIRMED, admin)).toBe(
        'invalid',
      );
    });

    it('rejects unknown stored statuses', () => {
      expect(checkTransition('archived', ORDER_STATUS.CANCELLED, admin)).toBe(
        'invalid',
      );
    });
  });

  it('normalizes stored status casing', () => {
    expect(normalizeStatus('rejected')).toBe('Rejected');
    expect(normalizeStatus('CONFIRMED')).toBe('confirmed');
    expect(normalizeStatus('nope')).toBeUndefined();
  });

  describe('dates', () => {
    const now = new Date(2026, 9, 24, 23, 30); // 24 Oct 2026, local time

    it('formats today in local time', () => {
      expect(todayISO(now)).toBe('2026-10-24');
    });

    it('treats only earlier days as past', () => {
      expect(isPastDate('2026-10-23', now)).toBe(true);
      expect(isPastDate('2026-10-24', now)).toBe(false);
      expect(isPastDate('2027-01-01', now)).toBe(false);
    });

    it('accepts only real YYYY-MM-DD dates', () => {
      expect(isCalendarDate('2028-02-29')).toBe(true);
      expect(isCalendarDate('2026-02-29')).toBe(false);
      expect(isCalendarDate('2026-13-01')).toBe(false);
      expect(isCalendarDate('2026-1-5')).toBe(false);
      expect(isCalendarDate('2026-10-24T00:00:00Z')).toBe(false);
      expect(isCalendarDate(20261024)).toBe(false);
    });
  });
});
