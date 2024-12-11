import { Request } from 'express';

export interface TokenPayload {
  refreshToken: string;
  accessToken: string;
}
export interface JwtPayload {
  userId: number;
  fullName: string;
  email: string;
  isAdmin: boolean;
}

export interface RequestWithUser extends Request {
  user: JwtPayload;
}

export interface RequestWithRefreshToken extends RequestWithUser {
  user: JwtPayload & { refreshToken: string };
}

export enum PromotionType {
  PERCENTAGE = 'PERCENTAGE',
  NET = 'NET',
  FLAT = 'FLAT',
}

export enum VoucherType {
  PERCENTAGE = 'PERCENTAGE',
  NET = 'NET',
}
