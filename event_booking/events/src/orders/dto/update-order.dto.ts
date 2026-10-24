import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsIn, IsOptional } from 'class-validator';
import { ORDER_STATUSES, OrderStatus } from '../order.rules';
import { CreateOrderDto } from './create-order.dto';

// Ownership cannot be reassigned; every other field may be updated partially.
export class UpdateOrderDto extends PartialType(
  OmitType(CreateOrderDto, ['customer_id'] as const),
) {
  @IsOptional()
  @IsIn(ORDER_STATUSES, {
    message: `status must be one of: ${ORDER_STATUSES.join(', ')}.`,
  })
  status?: OrderStatus;
}
