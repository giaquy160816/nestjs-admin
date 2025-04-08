import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { ProfileModule } from './modules/profile/profile.module';
import { PhotoModule } from './modules/photo/photo.module';
@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'admin',
            password: 'admin',
            database: 'my_db',
            entities: [],
            synchronize: true,
            autoLoadEntities: true,
            logging: true,
            ssl: false,
        }),
        UserModule, 
        ProfileModule, PhotoModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
