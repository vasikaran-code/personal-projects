import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { NormalizeEmail } from '../../common/validation';

export class LoginCustomerDto {
  @NormalizeEmail()
  @IsString()
  @IsNotEmpty({ message: 'Email is required.' })
  @MaxLength(254)
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required.' })
  @MaxLength(128)
  password: string;
}
