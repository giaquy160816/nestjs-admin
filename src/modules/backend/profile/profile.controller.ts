import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './entities/profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Post()
    create(@Body() createProfileDto: CreateProfileDto): Promise<Profile> {
        return this.profileService.create(createProfileDto);
    }

    @Get()
    findAll(): Promise<Profile[]> {
        return this.profileService.findAll();
    }

    @Get('search')
    search(@Query('q') q: string): Promise<Profile[]> {
        return this.profileService.search(q);
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Profile> {
        return this.profileService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto): Promise<Profile> {
        return this.profileService.update(+id, updateProfileDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<{ message: string }> {
        return this.profileService.remove(+id);
    }
}
