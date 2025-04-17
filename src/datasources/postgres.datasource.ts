import { DataSource } from "typeorm";
import * as dotenv from 'dotenv';
import { join } from 'path';
import configuration from '../config/configuration';

// Load environment variables from .env file
dotenv.config();

// Define the entities path
const entitiesPath = join(__dirname, '..', '**', '*.entity.{ts,js}');

const PostgresDataSource = new DataSource({
    type: configuration().database.type as any,
    host: configuration().database.host,
    port: configuration().database.port,
    username: configuration().database.username,
    password: configuration().database.password,
    database: configuration().database.database,
    entities: [entitiesPath],
    synchronize: true,
    logging: true,
    ssl: false,
});

// Don't initialize the DataSource here, let NestJS handle it
PostgresDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization', err);
    });

export default PostgresDataSource;