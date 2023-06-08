import { Module } from '@joktec/core';
import { SessionRepo } from './session.repo';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';

@Module({
  controllers: [SessionController],
  providers: [SessionRepo, SessionService],
  exports: [SessionService],
})
export class SessionModule {}
