import { BaseController, Controller, IBaseControllerProps, RequestMethod } from '@joktec/core';
import { ApartmentService } from './apartment.service';
import { Apartment } from './models';
import { ApartmentInterceptor } from './hooks';
import { AdminInterceptor } from '../../base';
import { RouteInfo } from '@nestjs/common/interfaces/middleware/middleware-configuration.interface';

const props: IBaseControllerProps<Apartment> = {
  dto: Apartment,
  useGuard: { findAll: false, findOne: false, create: true, update: true, delete: true },
  hooks: {
    create: [AdminInterceptor, ApartmentInterceptor],
    update: [AdminInterceptor, ApartmentInterceptor],
    delete: [AdminInterceptor, ApartmentInterceptor],
  },
};

@Controller('apartments')
export class ApartmentController extends BaseController<Apartment, string>(props) {
  constructor(protected apartmentService: ApartmentService) {
    super(apartmentService);
  }

  static excludeRoute(): RouteInfo {
    return { path: 'apartments', method: RequestMethod.GET };
  }
}
