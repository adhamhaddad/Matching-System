import {
  HttpException,
  HttpStatus,
  Injectable,
  Req,
  UseGuards,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Utils } from '@utils/utils';
import { User } from '@modules/users/schemas/users.schema';
import { UsersService } from '@modules/users/services/users.service';
import { PasswordHash } from '@utils/password-hash';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserStatus } from '@constants/user-status.constant';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly usersService: UsersService,
    private readonly passwordHash: PasswordHash,
    private readonly jwtService: JwtService,
    private readonly utils: Utils,
  ) {}

  async register(body: RegisterDto) {
    const salt = this.passwordHash.generateRandomSalt();
    const hashedPassword = await bcrypt.hash(body.password + salt, 10);
    body.salt = salt;
    body.password = hashedPassword;

    // save user data
    const user = await this.usersService.create(body);
    delete user.password;
    delete user.salt;

    return {
      data: user,
      message: 'Registered successfully',
    };
  }

  async login(body: LoginDto) {
    const { phone, password } = body;

    const user = await this.userModel
      .findOne({ phone, status: UserStatus.ACTIVE })
      .lean();
    if (!user)
      throw new HttpException(
        'Invalid phone number or password',
        HttpStatus.BAD_REQUEST,
      );

    const { salt } = user;

    const isPasswordMatch = await bcrypt.compare(
      password + salt,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new HttpException(
        'Invalid phone number or password',
        HttpStatus.BAD_REQUEST,
      );
    }

    delete user.password;
    delete user.salt;

    const token = await this.jwtService.signAsync({ user });

    return {
      message: 'Login successfully',
      token,
      data: user,
    };
  }

  async authMe(user: User) {
    const userData = await this.usersService.findOne(user.id);
    const token = await this.jwtService.signAsync({ user });

    return {
      message: 'Token generated Successfully',
      data: userData,
      token,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  async logout(@Req() request: Request) {
    const { access_token } = request.cookies;

    if (access_token) {
      //get all blacklisted tokens
      const blacklistedTokens =
        await this.utils.redisGetValue('blacklistedTokens');

      //parse blacklisted tokens
      const parsedBlackListedTokens = blacklistedTokens
        ? JSON.parse(blacklistedTokens)
        : [];

      //stringify blacklisted tokens
      const token = JSON.stringify([
        ...parsedBlackListedTokens,
        { token: access_token },
      ]);

      //setting blacklisted to redis
      await this.utils.redisSetValue('blacklistedTokens', token);

      return { status: true, token: access_token };
    }

    return { status: true, token: null };
  }
}
