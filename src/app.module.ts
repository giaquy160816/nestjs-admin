import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { ProfileModule } from './modules/profile/profile.module';
import { PhotoModule } from './modules/photo/photo.module';
import { CategoryModule } from './modules/category/category.module';
@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'myuser',
            password: 'mypassword',
            database: 'mydatabase',
            entities: [],
            synchronize: true,
            autoLoadEntities: true,
            logging: true,
            ssl: false,
        }),
        UserModule, 
        ProfileModule, 
        PhotoModule, 
        CategoryModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
