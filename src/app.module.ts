import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { ProfileModule } from './modules/profile/profile.module';
import { PhotoModule } from './modules/photo/photo.module';
import { CategoryModule } from './modules/category/category.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthMiddleware } from './middlewares/auth/auth.middleware';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import PostgresDataSource from './datasources/postgres.datasource';
import MysqlDataSource from './datasources/mysql.datasource';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env'],
            load: [configuration],
        }),
        TypeOrmModule.forRoot({
            ...PostgresDataSource.options,
            autoLoadEntities: true,
        }),
        // TypeOrmModule.forRoot({
        //     ...MysqlDataSource.options,
        //     autoLoadEntities: true,
        // }),
        // AuthModule is imported first to make JwtService available to other modules
        AuthModule,
        UserModule,
        ProfileModule,
        PhotoModule,
        CategoryModule,
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    ttl: 60000,
                    limit: 10,
                },
            ],
        }),
    ],
    controllers: [],
    providers: [
        {
            provide: 'APP_GUARD',
            useClass: ThrottlerGuard,
        }
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .exclude(
                { path: 'auth/login', method: RequestMethod.POST },
                { path: 'auth/register', method: RequestMethod.POST },
                { path: 'auth/refresh-token', method: RequestMethod.POST },
            )
            .forRoutes('*');
    }
}
