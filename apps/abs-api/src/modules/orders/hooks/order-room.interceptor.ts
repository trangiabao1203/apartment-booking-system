import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  plainToInstance,
  Request,
} from '@joktec/core';
import { Room, RoomService, RoomStatus } from '../../rooms';
import { Observable } from 'rxjs';
import { Order } from '../models';
import { Apartment } from '../../apartments';
import { head } from 'lodash';

@Injectable()
export class OrderRoomInterceptor implements NestInterceptor {
  constructor(private roomService: RoomService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<Request>();

    const orderInput = plainToInstance(Order, req.body);
    const rooms = await this.roomService.find({
      condition: { id: orderInput.roomId },
      populate: { apartment: '*' },
    });

    const room: Room = head(rooms);
    if (!orderInput.roomId || !room) {
      throw new BadRequestException('ROOM_REQUIRED');
    }

    if (room.status !== RoomStatus.ACTIVATED) {
      throw new BadRequestException('ROOM_NOT_AVAILABLE');
    }

    req.room = room;
    req.apartment = plainToInstance(Apartment, room.apartment);

    await this.roomService.lockRoom(room.id);
    return next.handle();
  }
}
