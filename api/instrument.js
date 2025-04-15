import * as Sentry from "@sentry/node";
import dotenv from 'dotenv';
dotenv.config();

console.log('Initializing Sentry...');
console.log('Sentry Environment:', process.env.NODE_ENV);
Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV
});