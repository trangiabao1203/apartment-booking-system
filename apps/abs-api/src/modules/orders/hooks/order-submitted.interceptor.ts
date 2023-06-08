import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  JwtPayload,
  NestInterceptor,
  plainToInstance,
  Request,
  toInt,
} from '@joktec/core';
import { Observable } from 'rxjs';
import { OrderRepo } from '../order.repo';
import { Apartment } from '../../apartments';
import { Order, OrderStatus, PaymentMethod } from '../models';
import { Room } from '../../rooms';
import moment from 'moment';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

const LIMIT_ORDER = 10;

@Injectable()
export class OrderSubmittedInterceptor implements NestInterceptor {
  constructor(private orderRepo: OrderRepo, @InjectQueue('order') private orderQueue: Queue) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<Request>();

    const payload = req.payload as JwtPayload;
    const orderInput = plainToInstance(Order, req.body);
    const room = plainToInstance(Room, req.room);
    const apartment = plainToInstance(Apartment, req.apartment);

    const [maxOrder, lastOrders] = await Promise.all([
      this.orderRepo.findOne({ condition: {}, sort: { sequence: 'desc' } }),
      this.orderRepo.find({
        condition: {
          userId: payload.sub,
          type: orderInput.type,
          createdAt: {
            $gte: moment().subtract(1, 'days').toDate(),
          },
        },
        sort: { sequence: 'desc' },
      }),
    ]);

    if (lastOrders.length >= LIMIT_ORDER) {
      throw new BadRequestException('LIMIT_10_ORDER');
    }

    const sequence: number = toInt(maxOrder?.sequence, 0) + 1;
    const code = `${apartment.code}.${room.code}${sequence.toString().padStart(6, '0')}`;

    req.body = Object.assign(orderInput, {
      code,
      sequence,
      title: `Booking no. #${code}`,
      subhead: `Booking room ${room.code} at ${apartment.title}`,
      serviceFee: room.price,
      paymentMethod: orderInput.paymentMethod || PaymentMethod.COD,
      userId: payload.sub,
      status: OrderStatus.PENDING,
      timelines: [
        { title: 'The booking is waiting for confirmed.' },
        { title: 'The booking have been sent successfully.' },
      ],
    });

    return next.handle();
  }
}
