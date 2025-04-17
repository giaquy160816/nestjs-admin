import { Controller, Post, Req, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Request } from 'express';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('login')
    @Throttle({ default: { limit: 2, ttl: 60000 } })
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto.email, loginDto.password);
    }

    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('refresh-token')
    refreshToken(@Req() req: Request) {
        const tokens = this.authService.refreshToken(req);
        return tokens;
    }
}
