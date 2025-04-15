import 'dotenv/config'
import pkg from 'pg'
import config from '../config/config.js'

const { Client } = pkg

const DEFAULT_DB = {
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    port: config.dbPort,
}

const client = config.databaseUrl
    ? new Client({ connectionString: config.databaseUrl, ssl: { rejectUnauthorized: false } })
    : new Client(DEFAULT_DB)

export async function connectToDatabase() {
    try {
        await client.connect()
        console.log('✅ Successfully connected to PostgreSQL')
    } catch (err) {
        console.error('❌ PostgreSQL error:', err.stack)
    }
}

connectToDatabase()

export default client
