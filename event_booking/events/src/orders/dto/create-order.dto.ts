import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateBy,
  ValidateIf,
} from 'class-validator';
import { Trim } from '../../common/validation';
import { EVENT_TYPES, isCalendarDate, PACKAGE_LEVELS } from '../order.rules';

const PHONE = /^\d{10}$/;

export class CreateOrderDto {
  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'Booking name is required.' })
  @MaxLength(100, { message: 'Booking name must be at most 100 characters.' })
  name: string;

  @IsIn(EVENT_TYPES, {
    message: `event_type must be one of: ${EVENT_TYPES.join(', ')}.`,
  })
  event_type: string;

  @ValidateBy({
    name: 'isCalendarDate',
    validator: {
      validate: isCalendarDate,
      defaultMessage: () =>
        'event_date must be a valid date in YYYY-MM-DD format.',
    },
  })
  event_date: string;

  @IsIn(PACKAGE_LEVELS, {
    message: `level must be one of: ${PACKAGE_LEVELS.join(', ')}.`,
  })
  level: string;

  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'Venue is required.' })
  @MaxLength(120, { message: 'Venue must be at most 120 characters.' })
  venue: string;

  @Trim()
  @Matches(PHONE, { message: 'contact must be a 10-digit phone number.' })
  contact: string;

  // The booking form sends "" when no alternative number is given.
  @Trim()
  @ValidateIf(
    (_, value) => value !== undefined && value !== null && value !== '',
  )
  @Matches(PHONE, {
    message: 'alternative_contact must be a 10-digit phone number.',
  })
  alternative_contact?: string;

  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'mail_id must be a valid email address.' })
  @MaxLength(254)
  mail_id: string;

  // Accepted for compatibility with the existing client, which sends its own id.
  // The owner is always taken from the auth token; a different id is rejected.
  @IsOptional()
  @IsString()
  customer_id?: string;
}
