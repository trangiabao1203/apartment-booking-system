import { Job, JwtPayload, LogService, plainToInstance, Process, Processor, toInt } from '@joktec/core';
import { Order, OrderStatus, PaymentMethod } from './models';
import { Room, RoomService, RoomStatus } from '../rooms';
import { OrderService } from './order.service';
import { head } from 'lodash';
import { Apartment } from '../apartments';
import moment from 'moment';

const LIMIT_ORDER = 10;

@Processor('order')
export class OrderConsumer {
  constructor(private logger: LogService, private roomService: RoomService, private orderService: OrderService) {}

  @Process('validate')
  async orderTransaction(job: Job) {
    const { data } = job;

    const payload = data.payload as JwtPayload;
    const orderInput = plainToInstance(Order, data.body);
    const rooms = await this.roomService.find({
      condition: { id: orderInput.roomId },
      populate: { apartment: '*' },
    });

    const room: Room = head(rooms);
    if (!orderInput.roomId || !room) {
      return job.moveToFailed({ message: 'ROOM_REQUIRED' }, true);
    }

    if (room.status !== RoomStatus.ACTIVATED) {
      return job.moveToFailed({ message: 'ROOM_NOT_AVAILABLE' }, true);
    }

    const apartment = plainToInstance(Apartment, room.apartment);
    await this.roomService.lockRoom(room.id);

    const [maxOrders, lastOrders] = await Promise.all([
      this.orderService.find({ sort: { sequence: 'desc' } }),
      this.orderService.find({
        sort: { sequence: 'desc' },
        condition: {
          userId: payload.sub,
          type: orderInput.type,
          createdAt: {
            $gte: moment().subtract(1, 'days').toDate(),
          },
        },
      }),
    ]);

    if (lastOrders.length >= LIMIT_ORDER) {
      return job.moveToFailed({ message: 'LIMIT_10_ORDER' }, true);
    }

    if (orderInput.bookingTime?.length) {
      const now = moment();
      const [startDate, endDate] = orderInput.bookingTime;
      if (!startDate || !endDate) {
        return job.moveToFailed({ message: 'BOOKING_TIME_REQUIRED' }, true);
      }

      if (moment(startDate).isSameOrBefore(now)) {
        return job.moveToFailed({ message: 'START_DATE_MUST_AFTER_NOW' }, true);
      }

      if (moment(startDate).isSameOrAfter(endDate)) {
        return job.moveToFailed({ message: 'START_DATE_MUST_BEFORE_END_DATE' }, true);
      }
    }

    const maxOrder = head(maxOrders);
    const sequence: number = toInt(maxOrder?.sequence, 0) + 1;
    const code = `${apartment.code}.${room.code}${sequence.toString().padStart(6, '0')}`;

    return Object.assign(orderInput, {
      code,
      sequence,
      title: `Booking no. #${code}`,
      subhead: `Booking room ${room.code} at ${apartment.title}`,
      serviceFee: room.price,
      paymentMethod: orderInput.paymentMethod || PaymentMethod.COD,
      userId: orderInput.userId || payload.sub,
      status: OrderStatus.PENDING,
      timelines: [
        { title: 'The booking is waiting for confirmed.' },
        { title: 'The booking have been sent successfully.' },
      ],
    });
  }
}
