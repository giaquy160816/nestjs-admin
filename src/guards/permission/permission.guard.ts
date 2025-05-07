import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CaslAbilityFactory } from 'src/modules/casl/ability/ability.factory';
import { Permissions } from 'src/decorators/permission.decorator';
import { Permission as IPermission } from 'src/interface/permission';
import { Reflector } from '@nestjs/core';
import { ForbiddenError } from '@casl/ability';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private caslAbilityFactory: CaslAbilityFactory,
        private reflector: Reflector
    ) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const userRoles = request.userRoles || [];

        // Remove JWT specific fields
        delete user.iat;
        delete user.exp;

        // Create ability with the user data
        const ability = this.caslAbilityFactory.createForUser(user);
        const requiredPermissions = this.reflector.get<IPermission[]>(Permissions, context.getHandler());
        
        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }

        try {
            console.log('requiredPermissions', requiredPermissions);
            ForbiddenError.from(ability).throwUnlessCan(requiredPermissions[0].action, requiredPermissions[0].subject);
            return true;
        } catch (error) {
            console.log('Permission error:', error);
            throw new UnauthorizedException('You do not have permission to perform this action');
        }
    }
}
