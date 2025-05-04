import { Auth } from '../entities/auth.entity';
import { PickType } from '@nestjs/mapped-types';

export class CreateAuthDto extends PickType(Auth, ['email', 'password'] as const) {}
