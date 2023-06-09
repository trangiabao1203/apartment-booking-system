import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  InjectQueue,
  NestInterceptor,
  Queue,
  Request,
} from '@joktec/core';
import { Observable } from 'rxjs';

@Injectable()
export class OrderSubmittedInterceptor implements NestInterceptor {
  constructor(@InjectQueue('order') private orderQueue: Queue) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<Request>();
    try {
      const job = await this.orderQueue.add('validate', { payload: req.payload, body: req.body }, {});
      await job.finished();
      req.body = job.returnvalue;
    } catch (err) {
      throw new BadRequestException(err.message);
    }

    return next.handle();
  }
}
