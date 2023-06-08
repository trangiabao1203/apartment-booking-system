import { Module } from '@joktec/core';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../users';
import { OtpModule } from '../otpLogs';
import { SessionModule } from '../sessions';

@Module({
  controllers: [AuthController],
  imports: [OtpModule, SessionModule, UserModule],
  providers: [AuthService],
})
export class AuthModule {}
