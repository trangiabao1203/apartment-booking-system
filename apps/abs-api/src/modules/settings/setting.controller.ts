import { BaseController, Controller, IBaseControllerProps } from '@joktec/core';
import { SettingService } from './setting.service';
import { Setting } from './models';

const props: IBaseControllerProps<Setting> = {
  dto: Setting,
};

@Controller('settings')
export class SettingController extends BaseController<Setting, string>(props) {
  constructor(protected settingService: SettingService) {
    super(settingService);
  }
}
