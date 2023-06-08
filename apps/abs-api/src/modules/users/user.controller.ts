import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  BaseController,
  Controller,
  IBaseControllerProps,
  JwtPayload,
  Param,
  Patch,
  Req,
  Request,
  UseInterceptors,
} from '@joktec/core';
import { UserService } from './user.service';
import { User } from './models';
import { UserBlockInterceptor, UserDenyInterceptor, UserGrantInterceptor } from './hooks';

const props: IBaseControllerProps<User> = {
  dto: User,
};

@Controller('users')
export class UserController extends BaseController<User, string>(props) {
  constructor(protected userService: UserService) {
    super(userService);
  }

  @Patch('/:id/grant')
  @ApiOperation({ summary: `Grant User Role` })
  @ApiOkResponse({ type: User })
  @ApiParam({ name: 'id', description: 'User ID' })
  @UseInterceptors(UserGrantInterceptor)
  async grant(@Param('id') id: string, @Req() res: Request): Promise<User> {
    return this.service.update(id, res.body, res.payload as JwtPayload);
  }

  @Patch('/:id/deny')
  @ApiOperation({ summary: `Deny User Role` })
  @ApiOkResponse({ type: User })
  @ApiParam({ name: 'id', description: 'User ID' })
  @UseInterceptors(UserDenyInterceptor)
  async deny(@Param('id') id: string, @Req() res: Request): Promise<User> {
    return this.service.update(id, res.body, res.payload as JwtPayload);
  }

  @Patch('/:id/block')
  @ApiOperation({ summary: `Block User` })
  @ApiOkResponse({ type: User })
  @ApiParam({ name: 'id', description: 'User ID' })
  @UseInterceptors(UserBlockInterceptor)
  async block(@Param('id') id: string, @Req() res: Request): Promise<User> {
    return this.service.update(id, res.body, res.payload as JwtPayload);
  }
}
