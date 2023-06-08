import { LogService } from '@joktec/core';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Order } from './models';

@Processor('order')
export class OrderProcessor {
  constructor(private logger: LogService) {}

  @Process('validate')
  handleTranscode(job: Job<Order>) {
    this.logger.debug('Start transcoding...');
    this.logger.debug(job.data);
    this.logger.debug('Transcoding completed');
  }
}
