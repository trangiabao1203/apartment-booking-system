import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@joktec/core';
import { OrderRepo } from '../order.repo';
import { Observable } from 'rxjs';
import { OrderStatus } from '../models';
import moment from 'moment';
import { OrderService } from '../order.service';

@Injectable()
export class OrderCheckinInterceptor implements NestInterceptor {
  constructor(private orderService: OrderService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const loggedUser = req.loggedUser;

    const order = await this.orderService.findOne(req.params.id);
    if (!order) return next.handle();
    if (order.status !== OrderStatus.PROCESSING) {
      throw new BadRequestException('ORDER_CAN_NOT_CHECKIN');
    }

    const now = moment();
    req.body = {
      status: OrderStatus.PROCESSING,
      checkinTime: now.toDate(),
      $push: {
        timelines: {
          $each: [{ title: `User ${loggedUser.fullName} has been checkin at ${now.toISOString()}` }],
          $position: 0,
        },
      },
    };

    return next.handle();
  }
}
