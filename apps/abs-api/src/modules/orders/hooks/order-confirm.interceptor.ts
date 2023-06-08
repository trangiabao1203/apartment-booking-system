import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@joktec/core';
import { OrderRepo } from '../order.repo';
import { Observable } from 'rxjs';
import { OrderStatus } from '../models';
import { OrderService } from '../order.service';

@Injectable()
export class OrderConfirmInterceptor implements NestInterceptor {
  constructor(private orderService: OrderService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const loggedUser = req.loggedUser;

    const order = await this.orderService.findOne(req.params.id);
    if (!order) return next.handle();
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('ORDER_CAN_NOT_CONFIRM');
    }

    req.body = {
      status: OrderStatus.CONFIRMED,
      $push: {
        timelines: {
          $each: [{ title: `Yêu cầu được xác nhận bởi quản trị viên ${loggedUser.fullName}` }],
          $position: 0,
        },
      },
    };

    return next.handle();
  }
}
