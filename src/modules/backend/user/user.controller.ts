import { Controller, Get, Post, Body, Param, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { Role } from 'src/enums/role.enum';
import { PermissionGuard } from 'src/guards/permission/permission.guard';
import { Permissions } from 'src/decorators/permission.decorator';
import { Action } from 'src/enums/action.enum';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Get('function')
    testFunction() {
        return this.userService.testFunction();
    }

    @Get('all')
    @UseGuards(AuthGuard, PermissionGuard)
    @Roles([Role.ADMIN, Role.USER])
    @Permissions([
        { action: Action.Read, subject: User }
    ])
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get('search')
    @UseGuards(AuthGuard, PermissionGuard)
    @Roles([Role.ADMIN])
    @Permissions([
        { action: Action.Read, subject: User }
    ])
    search(@Query('q') q: string): Promise<User[]> {
        return this.userService.search(q);
    }

    @Get(':id')
    @UseGuards(AuthGuard, PermissionGuard)
    @Roles([Role.ADMIN, Role.USER])
    @Permissions([
        { action: Action.Read, subject: User, fields: ['id'] }
    ])
    findOne(@Param('id') id: string): Promise<User> {
        return this.userService.findOne(id);
    }

    @Get()
    @UseGuards(AuthGuard, PermissionGuard)
    @Roles([Role.ADMIN, Role.USER])
    @Permissions([
        { action: Action.Read, subject: User }
    ])
    find(): Promise<User[]> {
        return this.userService.find();
    }

    @Post()
    @UseGuards(AuthGuard, PermissionGuard)
    @Roles([Role.ADMIN])
    @Permissions([
        { action: Action.Create, subject: User }
    ])
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }

    @Put(':id')
    @UseGuards(AuthGuard, PermissionGuard)
    @Roles([Role.ADMIN])
    @Permissions([
        { action: Action.Update, subject: User }
    ])
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard, PermissionGuard)
    @Roles([Role.ADMIN])
    @Permissions([
        { action: Action.Delete, subject: User }
    ])
    remove(@Param('id') id: string): Promise<{ message: string }> {
        return this.userService.remove(id);
    }
}
