import { PickType } from '@nestjs/swagger';
import { UserDto } from 'src/users/dto/user.dto';

export class signinDto extends PickType(UserDto, ['email', 'password']) {}
