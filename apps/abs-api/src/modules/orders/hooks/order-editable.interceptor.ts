import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@joktec/core';
import { Observable } from 'rxjs';
import { OrderRepo } from '../order.repo';
import { OrderStatus } from '../models';

@Injectable()
export class OrderInterceptor implements NestInterceptor {
  constructor(private orderRepo: OrderRepo) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    if (req.method === 'PUT') {
      const order = await this.orderRepo.findOne({ condition: { id: req.params.id } });
      if (order?.status !== OrderStatus.PENDING) {
        throw new BadRequestException('CAN_NOT_UPDATE_ORDER');
      }
    }

    return next.handle();
  }
}
