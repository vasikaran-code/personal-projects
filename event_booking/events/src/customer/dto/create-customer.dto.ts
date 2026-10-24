import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { NormalizeEmail, Trim } from '../../common/validation';

// customer_id and isAdmin are assigned by the server and cannot be supplied.
export class CreateCustomerDto {
  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'Name is required.' })
  @MaxLength(100, { message: 'Name must be at most 100 characters.' })
  cust_name: string;

  @NormalizeEmail()
  @IsString()
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Enter a valid email address.' })
  @MaxLength(254)
  email: string;

  @IsString()
  @MinLength(4, { message: 'Password must be at least 4 characters.' })
  @MaxLength(128, { message: 'Password must be at most 128 characters.' })
  password: string;
}
