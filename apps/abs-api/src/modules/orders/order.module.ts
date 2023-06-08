import { Module } from '@joktec/core';
import { OrderController } from './order.controller';
import { OrderRepo } from './order.repo';
import { OrderService } from './order.service';
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
import { ApartmentModule } from '../apartments';
import { RoomModule } from '../rooms';
import { BullModule } from '@nestjs/bull';

@Module({
  controllers: [OrderController],
  imports: [BullModule.registerQueue({ name: 'order' }), ApartmentModule, RoomModule],
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
