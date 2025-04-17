import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import configuration from '../../config/configuration';
import { extractTokenFromHeader } from '../../utils/token/extractToken.utils';
import { comparePassword, hashPassword } from '../../utils/password/password.utils';
import { User } from '../user/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { Request } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async validateUser(email: string, password: string): Promise<User | null> {
        try {
            const user = await this.userRepository.findOne({ where: { email } });

            if (!user) {
                return null;
            }

            // If user has no password (e.g., social login), return null
            if (!user.password) {
                return null;
            }

            const isPasswordValid = await comparePassword(password, user.password);

            if (!isPasswordValid) {
                return null;
            }

            return user;
        } catch (error) {
            console.error('Error validating user:', error);
            return null;
        }
    }

    async login(email: string, password: string) {
        const user = await this.validateUser(email, password);

        if (!user) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }

        const payload = {
            id: user.id,
            fullname: user.fullname,
            email: user.email,
            roles: user.roles,
        };

        const access_token = this.jwtService.sign(payload, {
            secret: configuration().jwt.secret,
            expiresIn: configuration().jwt.expires,
        });

        const refresh_token = this.jwtService.sign(payload, {
            secret: configuration().jwt.refresh,
            expiresIn: configuration().jwt.refreshExpires,
        });

        return {
            access_token,
            refresh_token,
            expires_in: configuration().jwt.expires,
            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email
            }
        };
    }

    async register(registerDto: RegisterDto) {
        // Check if user with this email already exists
        const existingUser = await this.userRepository.findOne({
            where: { email: registerDto.email }
        });

        if (existingUser) {
            throw new HttpException('User with this email already exists', HttpStatus.CONFLICT);
        }

        try {
            // Hash the password
            const hashedPassword = await hashPassword(registerDto.password);

            // Create the user
            const newUser = this.userRepository.create({
                fullname: registerDto.fullname,
                email: registerDto.email,
                password: hashedPassword
            });

            // Save the user to the database
            const savedUser = await this.userRepository.save(newUser);

            // Generate tokens
            const payload = {
                id: savedUser.id,
                fullname: savedUser.fullname,
                email: savedUser.email,
                roles: 'user'
            };

            const access_token = this.jwtService.sign(payload, {
                secret: configuration().jwt.secret,
                expiresIn: configuration().jwt.expires,
            });

            const refresh_token = this.jwtService.sign(payload, {
                secret: configuration().jwt.refresh,
                expiresIn: configuration().jwt.refreshExpires,
            });

            // Return tokens and user info
            return {
                access_token,
                refresh_token,
                expires_in: configuration().jwt.expires,
                user: {
                    id: savedUser.id,
                    fullname: savedUser.fullname,
                    email: savedUser.email
                }
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            console.error('Registration error:', error);
            throw new HttpException('Failed to register user', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    refreshToken(req: Request) {
        const refresh = extractTokenFromHeader(req) ?? '';
        if (!refresh) {
            throw new HttpException('Please provide a token', HttpStatus.UNAUTHORIZED);
        }
        try {
            const decodeToken = this.jwtService.verify(refresh, {
                secret: configuration().jwt.refresh,
            });
            const { iat, exp, ...payload } = decodeToken;
            const access_token = this.jwtService.sign(payload, {
                secret: configuration().jwt.secret,
                expiresIn: configuration().jwt.expires,
            });
            return {
                access_token,
                expires_in: configuration().jwt.expires,
            };
        } catch (error) {
            throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
        }
    }
}
