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
import { User } from 'src/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @ApiOperation({ summary: 'signin' })
  @ApiResponse({ status: 200, description: 'signin successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
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
    return res.status(HttpStatus.OK).json(rs.user);
  }

  @Post('signup')
  @ApiOperation({ summary: 'signup' })
  @ApiResponse({ status: 200, description: 'signup successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async signup(
    @Body() signupDto: signupDto,
    @Res() res: Response,
  ): Promise<Response> {
    await this.authService.signup(signupDto);
    return res.sendStatus(HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('signout')
  @ApiOperation({ summary: 'signout' })
  @ApiResponse({ status: 200, description: 'signout successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async signout(
    @Res() res: Response,
    @Req() req: RequestWithUser,
  ): Promise<Response> {
    await this.authService.signout(req.user.userId);
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    return res.sendStatus(HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @ApiOperation({ summary: 'refresh' })
  @ApiResponse({ status: 200, description: 'refresh successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async refresh(
    @Req() req: RequestWithRefreshToken,
    @Res() res: Response,
  ): Promise<Response> {
    const token = await this.authService.refreshToken(
      req.payload.refreshToken,
      req.payload.userId,
    );
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
    return res.sendStatus(HttpStatus.OK);
  }
}
