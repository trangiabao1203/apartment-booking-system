import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  ICondition,
  Injectable,
  NestInterceptor,
  ValidateException,
} from '@joktec/core';
import { Observable } from 'rxjs';
import { RoomRepo } from '../room.repo';
import { Room, RoomStatus } from '../models';

@Injectable()
export class RoomInterceptor implements NestInterceptor {
  constructor(private roomRepo: RoomRepo) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const { code } = req.body;

    if (req.method === 'POST' && code) {
      const condition: ICondition<Room> = { code };
      const room = await this.roomRepo.findOne({ condition });
      if (room) {
        throw new ValidateException({ code: ['ROOM_CODE_EXISTS'] });
      }
    }

    if (req.method === 'PUT' && code) {
      const condition: ICondition<Room> = { code, _id: { $ne: req.params.id } };
      const room = await this.roomRepo.findOne({ condition });
      if (room) {
        throw new ValidateException({ code: ['ROOM_CODE_EXISTS'] });
      }
    }

    if (req.method === 'DELETE') {
      const condition: ICondition<Room> = { code };
      const room = await this.roomRepo.findOne({ condition });
      if (room?.status !== RoomStatus.ACTIVATED) {
        throw new BadRequestException('ROOM_NOT_AVAILABLE');
      }
    }

    return next.handle();
  }
}
