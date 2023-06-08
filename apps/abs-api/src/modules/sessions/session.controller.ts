import { BaseController, Controller, ControllerExclude, IBaseControllerProps } from '@joktec/core';
import { SessionService } from './session.service';
import { Session } from './models';
import { SessionQueryInterceptor } from './hooks';

const props: IBaseControllerProps<Session> = {
  dto: Session,
  excludes: [ControllerExclude.WRITE],
  hooks: {
    findAll: [SessionQueryInterceptor],
  },
};

@Controller('sessions')
export class SessionController extends BaseController<Session, string>(props) {
  constructor(protected sessionService: SessionService) {
    super(sessionService);
  }
}
