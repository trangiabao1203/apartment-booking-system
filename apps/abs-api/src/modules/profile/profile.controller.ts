import {
  ApiBearerAuth,
  ApiBody,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  BaseValidationPipe,
  Body,
  Controller,
  Delete,
  GatewayPromInterceptor,
  Get,
  JwtGuard,
  Put,
  Req,
  Request,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@joktec/core';
import { ProfileService } from './profile.service';
import { UserFcmDto, UserLogoutDto, UserPasswordDto, UserProfile, UserProfileDto, UserRevokeDto } from './models';

@Controller('profile')
@ApiTags('profile')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@UseInterceptors(GatewayPromInterceptor)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get('/')
  @ApiOperation({ summary: `Get Profile` })
  @ApiOkResponse({ type: UserProfile })
  async getProfile(@Req() res: Request): Promise<any> {
    return this.profileService.getProfile(res['payload']);
  }

  @Put('/')
  @ApiOperation({ summary: `Update Profile` })
  @ApiBody({ type: UserProfileDto })
  @ApiOkResponse({ type: UserProfile })
  @UsePipes(new BaseValidationPipe({ skipMissingProperties: true }))
  async updateProfile(@Body() input: UserProfileDto, @Req() res: Request): Promise<UserProfile> {
    return this.profileService.updateProfile(input, res['payload']);
  }

  @Put('/password')
  @ApiOperation({ summary: `Change Password` })
  @ApiBody({ type: UserPasswordDto })
  @ApiOkResponse({ type: UserProfile })
  @UsePipes(new BaseValidationPipe())
  async changePassword(@Body() input: UserPasswordDto, @Req() res: Request): Promise<UserProfile> {
    return this.profileService.changePassword(input, res['payload']);
  }

  @Put('/fcm')
  @ApiOperation({ summary: `Update Registration ID` })
  @ApiBody({ type: UserFcmDto })
  @ApiOkResponse({ type: UserProfile })
  @UsePipes(new BaseValidationPipe())
  async updateRegistrationID(@Body() input: UserFcmDto, @Req() res: Request): Promise<UserProfile> {
    return this.profileService.updateRegistrationID(input, res['payload']);
  }

  @Delete('/')
  @ApiOperation({ summary: `Logout` })
  @ApiOkResponse({ type: UserLogoutDto })
  async logout(@Req() res: Request): Promise<UserLogoutDto> {
    return this.profileService.revokedMe(res['payload']);
  }

  @Delete('/revoke')
  @ApiOperation({ summary: `Revoke session` })
  @ApiBody({ type: UserRevokeDto })
  @ApiOkResponse({ type: UserLogoutDto })
  @ApiExcludeEndpoint()
  @UsePipes(new BaseValidationPipe())
  async revoke(@Body() input: UserRevokeDto, @Req() res: Request): Promise<UserLogoutDto> {
    return this.profileService.revokedOther(input.tokenIds, res['payload']);
  }
}
