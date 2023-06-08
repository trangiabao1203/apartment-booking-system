import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@joktec/core';
import { Observable } from 'rxjs';
import { OrderStatus } from '../models';
import moment from 'moment';
import { OrderService } from '../order.service';

@Injectable()
export class OrderEditableInterceptor implements NestInterceptor {
  constructor(private orderService: OrderService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    const order = await this.orderService.findOne(req.params.id);
    if (!order) return next.handle();

    const now = moment().startOf('second');
    const [startTime] = order.bookingTime;

    const allowUpdate: boolean =
      (order.status === OrderStatus.PENDING || order.status === OrderStatus.CONFIRMED) &&
      moment(startTime).isSameOrAfter(now, 'second');

    if (!allowUpdate) {
      throw new BadRequestException('CANNOT_UPDATE_ORDER');
    }

    return next.handle();
  }
}
