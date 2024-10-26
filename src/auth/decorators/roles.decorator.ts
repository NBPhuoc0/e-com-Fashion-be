import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/common/enum';

export const ROLES_KEY = 'isAdmin';
export const Roles = (roles: boolean) => SetMetadata(ROLES_KEY, roles);
