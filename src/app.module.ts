import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { TypeOrmModule }    from '@nestjs/typeorm';
import { UserModule }       from './modules/backend/user/user.module';
import { ProfileModule }    from './modules/backend/profile/profile.module';
import { PhotoModule }      from './modules/backend/photo/photo.module';
import { CategoryModule }   from './modules/backend/category/category.module';
import { AuthModule }       from './modules/backend/auth/auth.module';
import { ProductModule }    from './modules/backend/product/product.module';
import configuration        from './config/configuration';
import PostgresDataSource   from './datasources/postgres.datasource';
import MysqlDataSource      from './datasources/mysql.datasource';

import { SanitizeInputMiddleware } from './middlewares/sanitize-input.middleware';
import { RequestTimingMiddleware } from './middlewares/request-timing.middleware';
import { IpWhitelistMiddleware } from './middlewares/ip-whitelist.middleware';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env'],
            load: [configuration],
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: () => {
                return {
                    ...PostgresDataSource.options,
                    autoLoadEntities: true,
                    synchronize: true,
                }
            },
        }),
        /*
        TypeOrmModule.forRootAsync({
            name: 'mysqlConnection',
            inject: [ConfigService],
            useFactory: () => {
                return {
                    ...MysqlDataSource.options,
                    autoLoadEntities: true,
                    synchronize: true,
                }
            },
        }),
        */
        // AuthModule is imported first to make JwtService available to other modules
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    ttl: 60000,
                    limit: 10,
                },
            ],
        }),
        AuthModule,
        UserModule,
        ProfileModule,
        PhotoModule,
        CategoryModule,
        ProductModule
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
            .apply(IpWhitelistMiddleware, RequestTimingMiddleware, SanitizeInputMiddleware)
            .forRoutes('*');
    }
}