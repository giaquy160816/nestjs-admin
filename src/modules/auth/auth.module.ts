import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { AuthGuard } from '../../guards/auth/auth.guard';
import configuration from '../../config/configuration';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: configuration().jwt.secret,
            signOptions: { expiresIn: configuration().jwt.expires || '1h' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthGuard],
    exports: [AuthService, JwtModule, AuthGuard],
})
export class AuthModule { }
