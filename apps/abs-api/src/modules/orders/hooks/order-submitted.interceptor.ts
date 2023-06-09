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
import { RoomService } from '../../rooms';

@Injectable()
export class OrderSubmittedInterceptor implements NestInterceptor {
  constructor(@InjectQueue('order') private orderQueue: Queue, private roomService: RoomService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<Request>();
    try {
      const job = await this.orderQueue.add('validate', { payload: req.payload, body: req.body }, {});
      req.body = await job.finished();
      await this.roomService.lockRoom(req.body.roomId);
    } catch (err) {
      await this.roomService.releaseRoom(req.body.roomId);
      throw new BadRequestException(err.message);
    }

    return next.handle();
  }
}
