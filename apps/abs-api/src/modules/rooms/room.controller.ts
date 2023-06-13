import { BaseController, Controller, IBaseControllerProps, RequestMethod } from '@joktec/core';
import { RoomService } from './room.service';
import { Room } from './models';
import { RoomInterceptor } from './hooks';
import { AdminInterceptor } from '../../base';
import { RouteInfo } from '@nestjs/common/interfaces/middleware/middleware-configuration.interface';

const props: IBaseControllerProps<Room> = {
  dto: Room,
  useGuard: { findAll: false, findOne: false, create: true, update: true, delete: true },
  hooks: {
    findAll: [RoomInterceptor],
    create: [AdminInterceptor, RoomInterceptor],
    update: [AdminInterceptor, RoomInterceptor],
    delete: [AdminInterceptor, RoomInterceptor],
  },
};

@Controller('rooms')
export class RoomController extends BaseController<Room, string>(props) {
  constructor(protected roomService: RoomService) {
    super(roomService);
  }

  static excludeRoute(): RouteInfo {
    return { path: 'rooms', method: RequestMethod.GET };
  }
}
