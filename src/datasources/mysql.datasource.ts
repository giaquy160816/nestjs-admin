import { DataSource } from "typeorm";
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load environment variables from .env file
dotenv.config();

// Define the entities path
const entitiesPath = join(__dirname, '..', '**', '*.entity.{ts,js}');

const MysqlDataSource = new DataSource({
    type: process.env.DATABASE_MYSQL_TYPE as any || 'mysql',
    host: process.env.DATABASE_MYSQL_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_MYSQL_PORT || '3306'),
    username: process.env.DATABASE_MYSQL_USERNAME || 'root',
    password: process.env.DATABASE_MYSQL_PASSWORD || '@dmin1234',
    database: process.env.DATABASE_MYSQL_NAME || 'learn',
    entities: [entitiesPath],
    synchronize: true,
    logging: true,
    ssl: false,
});

// Don't initialize the DataSource here, let NestJS handle it
MysqlDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization', err);
    });

export default MysqlDataSource;