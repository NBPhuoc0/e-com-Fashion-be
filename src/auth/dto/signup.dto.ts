import { PickType } from '@nestjs/swagger';
import { UserDto } from 'src/users/dto/user.dto';

export class signupDto extends PickType(UserDto, [
  'fullName',
  'email',
  'password',
]) {}
