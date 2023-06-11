import { BaseService, IBaseRequest, Injectable, JwtPayload } from '@joktec/core';
import { mongoose } from '@joktec/mongo';
import { Room } from './models';
import { RoomRepo } from './room.repo';

@Injectable()
export class RoomService extends BaseService<Room, string> {
  constructor(protected roomRepo: RoomRepo) {
    super(roomRepo);
  }

  /**
   * Override findOne function to allow query by code
   * @param id
   * @param req
   * @param payload
   */
  async findOne(id: string, req: IBaseRequest<Room> = {}, payload?: JwtPayload): Promise<Room> {
    const findKey = mongoose.Types.ObjectId.isValid(id) ? 'id' : 'code';
    const findValue = findKey === 'code' ? id.toUpperCase() : id;
    req.condition = { [findKey]: findValue };
    return this.roomRepo.findOne(req);
  }
}
