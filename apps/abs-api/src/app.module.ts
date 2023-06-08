import {
  APP_FILTER,
  APP_GUARD,
  APP_INTERCEPTOR,
  ConfigModule,
  ConfigService,
  CoreModule,
  JwtModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  ResponseInterceptor,
  toInt,
  TrackInterceptor,
} from '@joktec/core';
import { MongoModule } from '@joktec/mongo';
import { StorageModule } from '@joktec/storage';
import { HttpModule } from '@joktec/http';
import { BullModule } from '@nestjs/bull';
import { AuthMiddleware, HttpExceptionFilter, RoleGuard } from './base';
import { OtpModule } from './modules/otpLogs';
import { SessionController, SessionModule } from './modules/sessions';
import { UserController, UserModule } from './modules/users';
import { AuthModule } from './modules/auth';
import { ProfileController, ProfileModule } from './modules/profile';
import { ApartmentController, ApartmentModule } from './modules/apartments';
import { AssetController, AssetModule } from './modules/assets';
import { OrderController, OrderModule } from './modules/orders';
import { SettingController, SettingModule } from './modules/settings';
import { RoomController, RoomModule } from './modules/rooms';

@Module({
  imports: [
    // Libs
    CoreModule,
    MongoModule,
    StorageModule,
    HttpModule,
    JwtModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const { host, port, queue, password } = cfg.get<any>('bull') ?? {};
        return {
          name: queue?.join(','),
          redis: {
            host: host || 'localhost',
            port: toInt(port, 6379),
            password,
          },
        };
      },
    }),
    // Modules
    OtpModule,
    SessionModule,
    UserModule,
    AuthModule,
    ProfileModule,
    ApartmentModule,
    RoomModule,
    SettingModule,
    AssetModule,
    OrderModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: TrackInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_GUARD, useClass: RoleGuard },
    AuthMiddleware,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        UserController,
        ProfileController,
        ApartmentController,
        RoomController,
        AssetController,
        OrderController,
        SettingController,
        SessionController,
      );
  }
}
