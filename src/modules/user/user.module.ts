import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        AuthModule, // Import AuthModule to get access to AuthGuard and JwtService
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule { }
