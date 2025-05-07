import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { matchRoles, Permissions } from 'src/decorators/permissions.decorator';


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(Permissions, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredPermissions) return true;

        const { user } = context.switchToHttp().getRequest();
        if (!user || !user.roles) return false;
        const userRoles = user.roles.split('|');
        const isMatch = matchRoles(userRoles, requiredPermissions);
        if (!isMatch) {
            throw new HttpException('Not enough permission', HttpStatus.FORBIDDEN);
        }
        return isMatch;
    }
}