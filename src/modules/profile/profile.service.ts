import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(Profile)
        private profileRepository: Repository<Profile>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async create(createProfileDto: CreateProfileDto): Promise<Profile> {
        try {
            const { userId, ...profileData } = createProfileDto;

            // If userId is provided, check if user exists
            if (userId) {
                const user = await this.userRepository.findOne({ where: { id: userId } });
                if (!user) {
                    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
                }

                // Create profile with user reference
                const profile = this.profileRepository.create({
                    ...profileData,
                    user: user
                });

                return await this.profileRepository.save(profile);
            } else {
                // Create profile without user reference
                const profile = this.profileRepository.create(profileData);
                return await this.profileRepository.save(profile);
            }
        } catch (error) {
            console.error('Create profile error:', error);
            throw new HttpException(
                error.message || 'Failed to create profile',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async findAll(): Promise<Profile[]> {
        try {
            return await this.profileRepository.find({
                relations: { user: true },
                select: {
                    id: true,
                    avatar: true,
                    user: {
                        id: true,
                        fullname: true,
                        email: true
                    }
                }
            });
        } catch (error) {
            console.error('Find all profiles error:', error);
            throw new HttpException(
                error.message || 'Failed to find profiles',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async search(q: string): Promise<Profile[]> {
        try {
            if (!q) {
                throw new HttpException('Search query is required', HttpStatus.BAD_REQUEST);
            }
            const queryBuilder = this.profileRepository
                .createQueryBuilder('profile')
                .leftJoinAndSelect('profile.user', 'user')
                .select(['profile.id', 'profile.avatar', 'user.id', 'user.fullname', 'user.email'])
                .where('LOWER(user.fullname) LIKE LOWER(:q)', { q: `%${q}%` })
                .orWhere('LOWER(user.email) LIKE LOWER(:q)', { q: `%${q}%` });

            const profiles = await queryBuilder.getMany();

            if (!profiles || profiles.length === 0) {
                throw new HttpException('No profiles found', HttpStatus.NOT_FOUND);
            }

            return profiles;
        }
        catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            console.error('Search error:', error);
            throw new HttpException(
                'Failed to search profiles', 
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async findOne(id: number): Promise<Profile> {
        try {
            const profile = await this.profileRepository.findOne({
                where: { id },
                relations: { user: true }
            });

            if (!profile) {
                throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
            }

            return profile;
        } catch (error) {
            console.error(`Find profile with id ${id} error:`, error);
            throw new HttpException(
                error.message || 'Failed to find profile',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async update(id: number, updateProfileDto: UpdateProfileDto): Promise<Profile> {
        try {
            const profile = await this.profileRepository.findOne({ where: { id } });

            if (!profile) {
                throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
            }

            const { userId, ...profileData } = updateProfileDto as any;

            // Update user reference if userId is provided
            if (userId !== undefined) {
                if (userId === null) {
                    // We need to handle this at the database level
                    await this.profileRepository.createQueryBuilder()
                        .relation(Profile, 'user')
                        .of(profile)
                        .set(null);
                } else {
                    // Update user reference
                    const user = await this.userRepository.findOne({ where: { id: userId } });
                    if (!user) {
                        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
                    }
                    profile.user = user;
                }
            }

            // Update profile data
            Object.assign(profile, profileData);

            return await this.profileRepository.save(profile);
        } catch (error) {
            console.error(`Update profile with id ${id} error:`, error);
            throw new HttpException(
                error.message || 'Failed to update profile',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async remove(id: number): Promise<{ message: string }> {
        try {
            const profile = await this.profileRepository.findOne({ where: { id } });
            if (!profile) {
                throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
            }

            await this.profileRepository.remove(profile);
            return { message: 'Profile deleted successfully' };
        } catch (error) {
            console.error(`Remove profile with id ${id} error:`, error);
            throw new HttpException(
                error.message || 'Failed to remove profile',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
