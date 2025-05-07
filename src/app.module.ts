import { APP_GUARD } from '@nestjs/core';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouterModule } from '@nestjs/core';


import configuration from './config/configuration';

//datasource
import PostgresDataSource from './datasources/postgres.datasource';
import MysqlDataSource from './datasources/mysql.datasource';

//middlewares
import { SanitizeInputMiddleware } from './middlewares/sanitize-input.middleware';
import { RequestTimingMiddleware } from './middlewares/request-timing.middleware';
import { IpWhitelistMiddleware } from './middlewares/ip-whitelist.middleware';

//routes
import { frontendRoutes, frontendModules } from './routes/frontend.routes';
import { backendRoutes, backendModules } from './routes/backend.routes';

//guards
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RolesGuard } from 'src/guards/auth/roles.guard';


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env'],
            load: [configuration],
        }),
        RouterModule.register([
            ...frontendRoutes,
            ...backendRoutes,
        ]),
        ...frontendModules,
        ...backendModules,

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
        })
    ],
    controllers: [],
    providers: [
        { provide: APP_GUARD, useClass: ThrottlerGuard },  //giới hạn số lần gọi API
        { provide: APP_GUARD, useClass: AuthGuard },
        { provide: APP_GUARD, useClass: RolesGuard },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(IpWhitelistMiddleware, RequestTimingMiddleware, SanitizeInputMiddleware)
            .forRoutes('*');
    }
}