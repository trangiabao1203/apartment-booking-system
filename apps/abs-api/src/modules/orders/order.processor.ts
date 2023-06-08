import { LogService } from '@joktec/core';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Order } from './models';
import { RoomService } from '../rooms';

@Processor('order')
export class OrderProcessor {
  constructor(private logger: LogService, private roomService: RoomService) {}

  @Process('validate')
  handleTranscode(job: Job<Order>) {
    const { data: order } = job;
  }
}
