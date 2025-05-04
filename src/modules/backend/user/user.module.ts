import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { PermissionGuard } from 'src/guards/permission/permission.guard';
import { CaslModule } from 'src/modules/casl/casl.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        AuthModule, // Import AuthModule to get access to AuthGuard and JwtService
        CaslModule, // Import CaslModule to get access to CaslAbilityFactory
    ],
    controllers: [UserController],
    providers: [UserService, PermissionGuard],
})
export class UserModule { }
