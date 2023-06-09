import { BaseController, Controller, IBaseControllerProps, RequestMethod } from '@joktec/core';
import { SettingService } from './setting.service';
import { Setting } from './models';
import { AdminInterceptor } from '../../base';
import { RouteInfo } from '@nestjs/common/interfaces/middleware/middleware-configuration.interface';

const props: IBaseControllerProps<Setting> = {
  dto: Setting,
  useGuard: { findAll: false, findOne: false, create: true, update: true, delete: true },
  hooks: {
    create: [AdminInterceptor],
    update: [AdminInterceptor],
    delete: [AdminInterceptor],
  },
};

@Controller('settings')
export class SettingController extends BaseController<Setting, string>(props) {
  constructor(protected settingService: SettingService) {
    super(settingService);
  }

  static excludeRoute(): RouteInfo {
    return { path: 'settings', method: RequestMethod.GET };
  }
}
