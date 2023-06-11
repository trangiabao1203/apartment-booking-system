import { BaseService, IBaseRequest, Injectable, JwtPayload } from '@joktec/core';
import { mongoose } from '@joktec/mongo';
import { Order, OrderStatus } from './models';
import { OrderRepo } from './order.repo';
import moment from 'moment';

@Injectable()
export class OrderService extends BaseService<Order, string> {
  constructor(protected orderRepo: OrderRepo) {
    super(orderRepo);
  }

  /**
   * Override findOne to allow find by code
   * @param id
   * @param req
   * @param payload
   */
  async findOne(id: string, req: IBaseRequest<Order> = {}, payload?: JwtPayload): Promise<Order> {
    const findKey = mongoose.Types.ObjectId.isValid(id) ? 'id' : 'code';
    const findValue = findKey === 'code' ? id.toUpperCase() : id;
    req.condition = { [findKey]: findValue };
    return this.orderRepo.findOne(req);
  }

  async findOverlappingOrders(timeRange: Date[], roomId: string): Promise<Order[]> {
    const [clientStartDate, clientEndDate] = timeRange;
    return this.orderRepo.find({
      condition: {
        roomId,
        status: { $nin: [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PROCESSING] },
        bookingTime: {
          $not: {
            $elemMatch: {
              $gte: moment(clientEndDate).endOf('days').toDate(),
              $lte: moment(clientStartDate).startOf('days').toDate(),
            },
          },
        },
      },
    });
  }
}
