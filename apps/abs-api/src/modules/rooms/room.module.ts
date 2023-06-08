import { Module } from '@joktec/core';
import { RoomController } from './room.controller';
import { RoomRepo } from './room.repo';
import { RoomService } from './room.service';
import { RoomInterceptor } from './hooks';

@Module({
  controllers: [RoomController],
  providers: [RoomRepo, RoomService, RoomInterceptor],
  exports: [RoomRepo, RoomService],
})
export class RoomModule {}
