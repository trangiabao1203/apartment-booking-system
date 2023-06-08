import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  BaseController,
  Controller,
  ControllerExclude,
  IBaseControllerProps,
  JwtPayload,
  Param,
  Patch,
  Req,
  Request,
  UseInterceptors,
} from '@joktec/core';
import { OrderService } from './order.service';
import { Order, OrderRejectDto } from './models';
import {
  OrderCancelInterceptor,
  OrderCheckinInterceptor,
  OrderCheckoutInterceptor,
  OrderConfirmInterceptor,
  OrderEditableInterceptor,
  OrderRejectInterceptor,
  OrderRoomInterceptor,
  OrderSubmittedInterceptor,
} from './hooks';
import { Roles } from '../../base';
import { UserRole } from '../users';
import { RoomService } from '../rooms';

const props: IBaseControllerProps<Order> = {
  dto: Order,
  excludes: [ControllerExclude.DELETE],
  hooks: {
    create: [OrderRoomInterceptor, OrderSubmittedInterceptor],
    update: [OrderEditableInterceptor],
  },
};

@Controller('orders')
export class OrderController extends BaseController<Order, string>(props) {
  constructor(protected orderService: OrderService, private roomService: RoomService) {
    super(orderService);
  }

  @Patch('/:id/cancel')
  @ApiOperation({ summary: `User Cancel` })
  @ApiOkResponse({ type: Order })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiBody({ type: OrderRejectDto })
  @Roles(UserRole.USER)
  @UseInterceptors(OrderEditableInterceptor, OrderCancelInterceptor)
  async cancel(@Param('id') id: string, @Req() res: Request): Promise<Order> {
    const order = await this.orderService.update(id, res.body, res.payload as JwtPayload);
    if (order) {
      await this.roomService.releaseRoom(order.id);
    }
    return order;
  }

  @Patch('/:id/checkin')
  @ApiOperation({ summary: `User checkin` })
  @ApiOkResponse({ type: Order })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @Roles(UserRole.USER)
  @UseInterceptors(OrderCheckinInterceptor)
  async checkin(@Param('id') id: string, @Req() res: Request): Promise<Order> {
    const order = await this.orderService.update(id, res.body, res.payload as JwtPayload);
    if (order) {
      await this.roomService.useRoom(order.id);
    }
    return order;
  }

  @Patch('/:id/checkout')
  @ApiOperation({ summary: `User checkout` })
  @ApiOkResponse({ type: Order })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @Roles(UserRole.USER)
  @UseInterceptors(OrderCheckoutInterceptor)
  async checkout(@Param('id') id: string, @Req() res: Request): Promise<Order> {
    const order = await this.orderService.update(id, res.body, res.payload as JwtPayload);
    if (order) {
      await this.roomService.releaseRoom(order.id);
    }
    return order;
  }

  // ---------
  @Patch('/:id/confirm')
  @ApiOperation({ summary: `Admin confirm` })
  @ApiOkResponse({ type: Order })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @Roles(UserRole.ADMIN)
  @UseInterceptors(OrderConfirmInterceptor)
  async confirm(@Param('id') id: string, @Req() res: Request): Promise<Order> {
    return this.orderService.update(id, res.body, res.payload as JwtPayload);
  }

  @Patch('/:id/reject')
  @ApiOperation({ summary: `Admin reject` })
  @ApiOkResponse({ type: Order })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiBody({ type: OrderRejectDto })
  @Roles(UserRole.ADMIN)
  @UseInterceptors(OrderRejectInterceptor)
  async reject(@Param('id') id: string, @Req() res: Request): Promise<Order> {
    const order = await this.orderService.update(id, res.body, res.payload as JwtPayload);
    if (order) {
      await this.roomService.releaseRoom(order.id);
    }
    return order;
  }
}
