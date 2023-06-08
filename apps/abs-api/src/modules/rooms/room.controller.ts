import { BaseController, Controller, IBaseControllerProps } from '@joktec/core';
import { RoomService } from './room.service';
import { Room } from './models';
import { RoomInterceptor } from './hooks';

const props: IBaseControllerProps<Room> = {
  dto: Room,
  hooks: {
    create: [RoomInterceptor],
    update: [RoomInterceptor],
  },
};

@Controller('rooms')
export class RoomController extends BaseController<Room, string>(props) {
  constructor(protected roomService: RoomService) {
    super(roomService);
  }
}
