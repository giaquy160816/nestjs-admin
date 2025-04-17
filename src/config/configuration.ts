export default () => ({
    database: {
        type: process.env.DATABASE_TYPE,
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT ?? '0'),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
    },
    jwt: {
        secret: process.env.JWT_SECRET_KEY,
        expires: process.env.JWT_SECRET_EXPIRES_IN,
        refresh: process.env.JWT_REFRESH_KEY,
        refreshExpires: process.env.JWT_REFRESH_EXPIRES_IN,
    },
    cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS
            ? process.env.ALLOWED_ORIGINS.split(',')
            : ['http://localhost:3000', 'http://localhost:4000'],
    },
});
