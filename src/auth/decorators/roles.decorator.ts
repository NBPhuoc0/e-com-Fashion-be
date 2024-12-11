import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/common/common.e';

export const ROLES_KEY = 'isAdmin';
export const Roles = (roles: boolean) => SetMetadata(ROLES_KEY, roles);
