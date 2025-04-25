import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { matchRoles, Roles } from '../../decorators/roles.decorator';
import { extractTokenFromHeader } from '../../utils/token/extractToken.utils';
import configuration from '../../config/configuration';
import { log } from 'console';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector
    ) { }

    canActivate( context: ExecutionContext ): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<string[]>(Roles, context.getHandler());
        if (!roles) return true;

        const request = context.switchToHttp().getRequest();
        const token = extractTokenFromHeader(request);

        if (!token){
            throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
        }

        try {
            const decodeToken = this.jwtService.verify(token, {
                secret: configuration().jwt.secret,
            });
            const userRoles = decodeToken.roles ? decodeToken.roles.split(',') : [];

            console.log(userRoles, roles);

            if (!matchRoles(userRoles, roles)) {
                throw new HttpException('Not enough permission', HttpStatus.FORBIDDEN);
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            console.log(error);
            // Handle JWT-specific errors
            switch (error.name) {
                case 'TokenExpiredError':
                    throw new HttpException('Token Expired', HttpStatus.UNAUTHORIZED);
                case 'JsonWebTokenError':
                    throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
                default:
                    throw new HttpException('Not Valid Token', HttpStatus.UNAUTHORIZED);
            }
        }
        return true;
    }
}
