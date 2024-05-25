import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { User } from '@decorators/user.decorator';
import { JwtAuthGuard } from '../guards/auth.guard';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { message, token, data } = await this.authService.login(body);
    const expiresIn = 3 * 60 * 60 * 1000;
    const expirationDate = new Date(Date.now() + expiresIn);

    if (token)
      response.cookie('access_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        expires: expirationDate,
      });

    return { message, data };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() request: Request | any,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { status } = await this.authService.logout(request);
    if (status) {
      response.clearCookie('access_token', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      });
      return { message: 'Logout Successfully' };
    }
    throw new HttpException(
      'Something went wrong',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async authMe(
    @Res({ passthrough: true }) response: Response,
    @User() user: any,
  ) {
    const { message, data, token } = await this.authService.authMe(user);
    const expiresIn = 3 * 60 * 60 * 1000;
    const expirationDate = new Date(Date.now() + expiresIn);

    response.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: expirationDate,
    });
    return { message, data: { user: data, token } };
  }
}
