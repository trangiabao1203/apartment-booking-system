import { BaseController, Controller, IBaseControllerProps } from '@joktec/core';
import { ApartmentService } from './apartment.service';
import { Apartment } from './models';
import { ApartmentInterceptor } from './hooks';

const props: IBaseControllerProps<Apartment> = {
  dto: Apartment,
  hooks: {
    create: [ApartmentInterceptor],
    update: [ApartmentInterceptor],
    delete: [ApartmentInterceptor],
  },
};

@Controller('apartments')
export class ApartmentController extends BaseController<Apartment, string>(props) {
  constructor(protected apartmentService: ApartmentService) {
    super(apartmentService);
  }
}
