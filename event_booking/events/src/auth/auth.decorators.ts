import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';

export const IS_PUBLIC = 'auth:isPublic';
export const ADMIN_ONLY = 'auth:adminOnly';

// The signed-in caller, resolved by AuthGuard from the bearer token.
export interface AuthUser {
  customer_id: string;
  isAdmin: boolean;
}

/** Route needs no authentication. */
export const Public = () => SetMetadata(IS_PUBLIC, true);

/** Route is limited to admins (customer.isAdmin). */
export const AdminOnly = () => SetMetadata(ADMIN_ONLY, true);

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthUser =>
    ctx.switchToHttp().getRequest().user,
);
