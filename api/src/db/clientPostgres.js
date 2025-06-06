import pkg from 'pg';
import config from '../config/config.js';

const { Pool } = pkg;

const client = config.databaseUrl
    ? new Pool({
        connectionString: config.databaseUrl,
        ssl: { rejectUnauthorized: false },
    })
    : new Pool({
        host: config.dbHost,
        user: config.dbUser,
        password: config.dbPassword,
        database: config.dbName,
        port: config.dbPort,
    });

export async function testConnection() {
    try {
        await client.query('SELECT 1');
        console.log('✅ Successfully connected to PostgreSQL database');
    } catch (error) {
        console.error('❌ Error connecting to PostgreSQL database:', error.stack);
    }
}

export default client;
