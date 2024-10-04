import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2';
import { User } from 'src/entities/user.entity';
import { JwtPayload, TokenPayload } from 'src/common/interface';
import { signupDto } from './dto/signup.dto';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}
  private logger = new Logger('AuthService');

  private async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  private async validateUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.usersService.findUserByEmail(email);
    if (user && (await argon2.verify(user.password, password))) {
      return user;
    }
    return null;
  }

  private getJwtToken(user: User): TokenPayload {
    const payload: JwtPayload = {
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
    };
    const token = {
      accessToken: this.jwtService.sign(
        { payload },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15y', // !!!! nhớ đổi lại
        },
      ),
      refreshToken: this.jwtService.sign(
        { userId: user.userId },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    };

    this.usersService.updateUser(user.userId, {
      refreshToken: token.refreshToken,
    });

    return token;
  }

  async signin(
    email: string,
    password: string,
  ): Promise<{ token: TokenPayload; user: User }> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user || !(await argon2.verify(user.password, password))) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    delete user.password;
    delete user.refreshToken;
    delete user.role;
    const token = this.getJwtToken(user);

    return { token, user };
  }

  async signup(signupDto: signupDto): Promise<void> {
    const user = await this.usersService.findUserByEmail(signupDto.email);
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await this.hashPassword(signupDto.password);
    await this.usersService.createUser({
      ...signupDto,
      password: hashedPassword,
    });
    return;
  }

  async signout(userId: number): Promise<void> {
    await this.usersService.updateUser(userId, {
      refreshToken: null,
    });
    return;
  }

  async refreshToken(
    refreshToken: string,
    userId: number,
  ): Promise<TokenPayload> {
    const user = await this.usersService.findOneUser(userId);
    if (!user || user.refreshToken !== refreshToken) {
      return null;
    }
    return this.getJwtToken(user);
  }
}
