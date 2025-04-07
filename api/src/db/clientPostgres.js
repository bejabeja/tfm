import 'dotenv/config'
import pkg from 'pg'

const { Client } = pkg

const DEFAULT_DB = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
}

const client = process.env.DATABASE_URL
    ? new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
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
