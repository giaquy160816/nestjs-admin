import { Injectable, ConflictException, BadRequestException, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import configuration from 'src/config/configuration';
import { generateTokens } from 'src/utils/token/jwt.utils';
import { log } from 'console';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Auth)
        private authRepository: Repository<Auth>,
        private jwtService: JwtService,
    ) {}

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;
        const auth = await this.authRepository.findOne({
            where: { email },
            relations: ['user']
        });
        if (!auth) {
            throw new BadRequestException('Invalid email or password');
        }
        const isMatch = await bcrypt.compare(password, auth.password);
        if (!isMatch) {
            throw new BadRequestException('Invalid email or password');
        }
        const payload = { 
            sub: auth.user.id, 
            email: auth.email,
            fullname: auth.user.fullname,
            roles: auth.user.roles.join(',')  // Convert array to string
        };
        console.log(payload);
        const tokens = generateTokens(this.jwtService, payload);
        return {
            token: tokens,
            message: 'Login successful',
            data: { email: auth.email },
        };
    }

    async register(registerDto: RegisterDto) {
        const { email, fullname, password } = registerDto;

        // Check if email already exists
        const existingAuth = await this.authRepository.findOne({ where: { email } });
        
        if (existingAuth) {
            throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
        }

        // Hash password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new auth
        const auth = this.authRepository.create({
            email,
            fullname,
            password: hashedPassword,
        });

        // Save to database
        await this.authRepository.save(auth);

        return {
            message: 'Registration successful',
            data: {
                id: auth.id,
                email: auth.email,
            }
        };
    }

    async refreshToken(refreshTokenDto: RefreshTokenDto) {
        const { refreshToken } = refreshTokenDto;
        let decoded: any;
        try {
            decoded = this.jwtService.verify(refreshToken, {
                secret: configuration().jwt.refresh,
            });
        } catch (err) {
            throw new BadRequestException('Invalid refresh token');
        }
        const payload = { sub: decoded.sub, email: decoded.email };
        const tokens = generateTokens(this.jwtService, payload);
        return {
            token: tokens,
            message: 'Token refreshed',
            data: { email: payload.email },
        };
    }
} 