import { Controller, Get, Post, Body, Param, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../../decorators/roles.decorator';
import { AuthGuard } from '../../guards/auth/auth.guard';
import { Role } from '../../enums/role.enum';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Get('function')
    testFunction() {
        return this.userService.testFunction();
    }

    @Get('all')
    @UseGuards(AuthGuard)
    @Roles([Role.ADMIN, Role.USER])
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get('search')
    @UseGuards(AuthGuard)
    @Roles([Role.ADMIN])
    search(@Query('q') q: string): Promise<User[]> {
        return this.userService.search(q);
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    @Roles([Role.ADMIN])
    findOne(@Param('id') id: string): Promise<User> {
        return this.userService.findOne(id);
    }

    @Get()
    @UseGuards(AuthGuard)
    @Roles([Role.ADMIN, Role.USER])
    find(): Promise<User[]> {
        return this.userService.find();
    }

    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<{ message: string }> {
        return this.userService.remove(id);
    }
}
