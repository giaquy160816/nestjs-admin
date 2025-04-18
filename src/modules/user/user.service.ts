import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import PostgresDataSource from '../../datasources/postgres.datasource';
import { hashPassword } from '../../utils/password/password.utils';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        // If password is provided, hash it before saving
        if (createUserDto.password) {
            createUserDto.password = await hashPassword(createUserDto.password);
        }

        const user = this.userRepository.create(createUserDto);

        return this.userRepository.save(user);
    }

    async testFunction() {

        const queryRunner = PostgresDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const qr = await queryRunner.query(`CALL update_car_name($1, $2)`, [1, null]);
            await queryRunner.commitTransaction()
            return qr;
        } catch (error) {
            console.error('Error:', error);
            await queryRunner.rollbackTransaction()
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release()
        }

    }

    async find(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.profile', 'profile')
            .leftJoinAndSelect('user.photos', 'photos')
            .select([
                'user.id',
                'user.fullname',
                'user.email',
                'profile.avatar',
                'profile.id',
                'photos.id',
                'photos.name',
                'photos.filename',
            ])
            .getMany();
    }

    async search(q: string): Promise<User[]> {
        try {
            const users = await this.userRepository.find({
                where: [
                    { fullname: Like(`%${q}%`) },
                    { email: Like(`%${q}%`) },
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

        // If password is being updated, hash it
        if (updateUserDto.password) {
            updateUserDto.password = await hashPassword(updateUserDto.password);
        }

        return this.userRepository.save({ ...user, ...updateUserDto });
    }

    async remove(id: string): Promise<{ message: string }> {
        try {
            // Get the EntityManager from the repository
            const entityManager = this.userRepository.manager;

            // Find user with profile relation
            const user = await this.userRepository.findOne({
                where: { id: Number(id) },
                relations: { profile: true }
            });

            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            // Start a transaction
            await entityManager.transaction(async transactionalEntityManager => {
                // If profile exists, remove it first
                if (user.profile) {
                    await transactionalEntityManager
                        .getRepository('Profile')
                        .delete(user.profile.id);
                    console.log('Profile deleted successfully');
                } else {
                    console.log('No profile found for this user');
                }

                // Then remove the user
                await transactionalEntityManager
                    .getRepository('User')
                    .delete(user.id);
            });

            return { message: 'User and profile deleted successfully' };

        } catch (error) {
            console.error('Error removing user:', error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Failed to remove user',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
