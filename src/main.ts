import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TimeoutInterceptor } from './interceptors/timeout/timeout.interceptor';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new TimeoutInterceptor());
    // Allow all origins for CORS

    app.enableCors({
        origin: true, // Allow all origins
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    await app.listen(process.env.PORT ?? 3000); // Changed port to 5000
}
bootstrap();
