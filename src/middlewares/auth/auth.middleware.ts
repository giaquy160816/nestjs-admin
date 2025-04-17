import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { extractTokenFromHeader } from '../../utils/token/extractToken.utils';
import configuration from '../../config/configuration';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private jwtService: JwtService
    ) {}

    use(req: Request, res: Response, next: () => void) {
        const token = extractTokenFromHeader(req);

        if (!token) {
            throw new HttpException('Please provide a token', HttpStatus.UNAUTHORIZED);
        }
        try{
            const decodeToken = this.jwtService.verify(token, {
                secret: configuration().jwt.secret,
            });
        } catch (error) {
            throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
        }finally {
            next();
        }
    }
}
