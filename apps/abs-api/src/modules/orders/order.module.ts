import { Module } from '@joktec/core';
import { OrderController } from './order.controller';
import { OrderRepo } from './order.repo';
import { OrderService } from './order.service';
import {
  OrderCancelInterceptor,
  OrderConfirmInterceptor,
  OrderCheckoutInterceptor,
  OrderEditableInterceptor,
  OrderCheckinInterceptor,
  OrderRejectInterceptor,
  OrderRoomInterceptor,
  OrderSubmittedInterceptor,
} from './hooks';
import { ApartmentModule } from '../apartments';
import { RoomModule } from '../rooms';

@Module({
  controllers: [OrderController],
  imports: [ApartmentModule, RoomModule],
  providers: [
    OrderRepo,
    OrderService,
    OrderRoomInterceptor,
    OrderSubmittedInterceptor,
    OrderEditableInterceptor,
    OrderCancelInterceptor,
    OrderCheckinInterceptor,
    OrderCheckoutInterceptor,
    OrderConfirmInterceptor,
    OrderRejectInterceptor,
  ],
  exports: [OrderService],
})
export class OrderModule {}
