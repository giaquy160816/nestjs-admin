import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = this.userRepository.create(createUserDto);
        return this.userRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async search(q: string): Promise<User[]> {
        try {
            const users = await this.userRepository.find({
                where: [
                    { fullName: Like(`%${q}%`) },
                    { email: Like(`%${q}%`) },
                    { gender: q.toLowerCase() === 'male' || q.toLowerCase() === 'female' ? q.toLowerCase() : undefined }
                ]
            });
            if (users.length === 0) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            return users;
        } catch (error) {
            console.error('Search error:', error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findOne(id: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: Number(id) } });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: Number(id) } });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return this.userRepository.save({ ...user, ...updateUserDto });
    }

    async remove(id: string): Promise<{ message: string }> {
        const user = await this.userRepository.findOne({ where: { id: Number(id) } });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        await this.userRepository.delete(id);
        return { message: 'User deleted successfully' };
    }
}
