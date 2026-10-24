import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/sequelize';
import { Customer } from '../customer/entities/customer.entity';
import { ADMIN_ONLY, AuthUser, IS_PUBLIC } from './auth.decorators';
import { TokenService } from './token.service';

// Global guard: every route requires a valid bearer token unless marked @Public().
// The caller is re-read from the database so admin rights and deleted accounts
// take effect immediately rather than when the token expires.
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokens: TokenService,
    @InjectModel(Customer) private readonly customers: typeof Customer,
  ) {}

  async canActivate(context: ExecutionContext) {
    const targets = [context.getHandler(), context.getClass()];
    if (this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, targets)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const [scheme, token] = (request.headers.authorization ?? '').split(' ');
    const customerId = scheme === 'Bearer' ? this.tokens.verify(token) : null;
    if (!customerId) {
      throw new UnauthorizedException('Please sign in to continue.');
    }

    const customer = await this.customers.findOne({
      where: { customer_id: customerId },
      attributes: ['customer_id', 'isAdmin'],
    });
    if (!customer) {
      throw new UnauthorizedException(
        'Your session is no longer valid. Please sign in again.',
      );
    }

    const user: AuthUser = {
      customer_id: customer.customer_id,
      isAdmin: !!customer.isAdmin,
    };
    request.user = user;

    if (
      this.reflector.getAllAndOverride<boolean>(ADMIN_ONLY, targets) &&
      !user.isAdmin
    ) {
      throw new ForbiddenException('Only administrators can do this.');
    }
    return true;
  }
}
