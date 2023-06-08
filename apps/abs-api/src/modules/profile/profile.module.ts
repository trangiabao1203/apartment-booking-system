import { Module } from '@joktec/core';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UserModule } from '../users';
import { SessionModule } from '../sessions';
import { OtpModule } from '../otpLogs';

@Module({
  controllers: [ProfileController],
  imports: [OtpModule, SessionModule, UserModule],
  providers: [ProfileService],
})
export class ProfileModule {}
