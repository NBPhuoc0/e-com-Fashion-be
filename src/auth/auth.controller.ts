import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  Req,
  Logger,
} from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signinDto } from './dto/signin.dto';
import { signupDto } from './dto/signup.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  RequestWithRefreshToken,
  RequestWithUser,
  TokenPayload,
} from 'src/common/interface';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private logger = new Logger(AuthController.name);

  @Post('signin')
  @ApiOperation({ summary: 'signin' })
  async signin(
    @Body() signinDto: signinDto,
    @Res() res: Response,
  ): Promise<Response> {
    const rs = await this.authService.signin(
      signinDto.email,
      signinDto.password,
    );
    res.cookie('refreshToken', rs.token.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.cookie('accessToken', rs.token.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json(rs);
  }

  @Post('signup')
  @ApiOperation({ summary: 'signup' })
  async signup(@Body() signupDto: signupDto) {
    await this.authService.signup(signupDto);
    return { message: 'signup success' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('signout')
  @ApiOperation({ summary: 'signout' })
  async signout(
    @Res() res: Response,
    @Req() req: RequestWithUser,
  ): Promise<Response> {
    await this.authService.signout(req.user.userId);
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    return res.json({ message: 'signout success' });
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @ApiOperation({ summary: 'refresh' })
  async refresh(
    @Req() req: RequestWithRefreshToken,
    @Res() res: Response,
  ): Promise<Response> {
    const token = await this.authService.refreshToken(
      req.user.refreshToken,
      req.user.userId,
    );
    // this.logger.log(token);
    res.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.cookie('accessToken', token.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res.json({ message: 'refresh success' });
  }
}
