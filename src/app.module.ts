import { Module } from '@nestjs/common';
import { UserModule } from './domains/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
    imports: [
        UserModule, 
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
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
