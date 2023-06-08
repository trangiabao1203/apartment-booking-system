import { BadRequestException, CallHandler, ExecutionContext, Injectable, isEmpty, NestInterceptor } from '@joktec/core';
import { Observable } from 'rxjs';
import { OrderStatus } from '../models';
import { OrderService } from '../order.service';

@Injectable()
export class OrderCancelInterceptor implements NestInterceptor {
  constructor(private orderService: OrderService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const loggedUser = req.loggedUser;

    const reason = req.body.reason;
    if (isEmpty(reason)) throw new BadRequestException('REASON_REQUIRED');

    const order = await this.orderService.findOne(req.params.id);
    if (!order) return next.handle();
    if (![OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(order.status)) {
      throw new BadRequestException('ORDER_CANNOT_BE_CANCEL');
    }

    req.body = {
      cancelReason: reason,
      status: OrderStatus.CANCEL,
      $push: {
        timelines: {
          $each: [{ title: `The booking is cancel by user ${loggedUser.fullName} with reason: ${reason}` }],
          $position: 0,
        },
      },
    };

    return next.handle();
  }
}
