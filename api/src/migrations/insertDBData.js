import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import pkg from 'pg';
import config from '../config/config.js';

const { Client } = pkg;

const client = new Client({
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    port: config.dbPort,
});

async function insertInitialData() {
    try {
        await client.connect();
        console.log('✅ Successfully connected to PostgreSQL');

        const __dirname = path.dirname(new URL(import.meta.url).pathname);
        console.log(__dirname);

        // Read the SQL data insertion files (if any)
        const dataFiles = fs.readdirSync(path.join(__dirname, '../migrations/insert_data'))
            .filter(file => file.endsWith('.sql')) 
            .sort(); 

        for (let i = 0; i < dataFiles.length; i++) {
            const dataFile = dataFiles[i];

            const dataPath = path.join(__dirname, '../migrations/insert_data', dataFile);
            const insertQuery = fs.readFileSync(dataPath, 'utf8');

            console.log(`Running insert data: ${dataFile}`);
            await client.query(insertQuery);
        }

        console.log('✅ Successfully inserted data into tables');
    } catch (error) {
        console.error('❌ Error inserting data:', error);
    } finally {
        await client.end();
    }
}

insertInitialData();
