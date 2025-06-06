import { Router } from "express";
import client from '../db/clientPostgres.js';

export const healthCheckRouter = () => {
    const router = Router();
    router.get('/health-check', async (req, res) => {
        try {
            await client.query('SELECT 1');
            res.status(200).json({ status: 'ok', message: 'DB connection is healthy' });
        } catch (error) {
            console.error('Health check failed:', error);
            res.status(500).json({ status: 'error', message: 'DB connection failed' });
        }
    });

    return router;
};
