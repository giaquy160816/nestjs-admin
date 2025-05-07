import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { matchRoles, Roles } from 'src/decorators/roles.decorator';
import { extractTokenFromHeader } from 'src/utils/token/extractToken.utils';
import configuration from 'src/config/configuration';
import * as roleUtils from 'src/utils/role/role.utils';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { decryptPayload } from 'src/utils/token/jwt-encrypt.utils';
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
        @InjectDataSource('default') private dataSource: DataSource
    ) { }

    async canActivate( context: ExecutionContext ): Promise<boolean> {
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
            const dataPayload = decryptPayload(decodeToken.data) as JwtDecryptedPayload;
            const userRoles = dataPayload.roles.split('|');

            console.log('dataPayload', dataPayload);
            console.log('roles', roles);
            // console.log('userRoles', userRoles);
            console.log('userRoles', userRoles);


            const isMatch = matchRoles(userRoles, roles);
            if (!isMatch) {
                throw new HttpException('Not enough permission', HttpStatus.FORBIDDEN);
            }
            return isMatch;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

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
    }
}
