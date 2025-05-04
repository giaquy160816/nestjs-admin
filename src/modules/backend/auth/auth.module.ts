import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from '../../../config/configuration';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@Module({
    imports: [
        TypeOrmModule.forFeature([Auth]),
        JwtModule.register({
            secret: configuration().jwt.secret,
            signOptions: { expiresIn: configuration().jwt.expires || '1h' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtService, AuthGuard],
    exports: [AuthService, JwtModule, AuthGuard],
})
export class AuthModule { }
