import { BullModule, Module } from '@joktec/core';
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
  OrderSubmittedInterceptor,
} from './hooks';
import { ApartmentModule } from '../apartments';
import { RoomModule } from '../rooms';
import { OrderConsumer } from './order.consumer';

@Module({
  controllers: [OrderController],
  imports: [BullModule.registerQueue({ name: 'order' }), ApartmentModule, RoomModule],
  providers: [
    OrderRepo,
    OrderService,
    OrderConsumer,
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
