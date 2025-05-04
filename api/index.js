import * as Sentry from "@sentry/node";
import cookieParser from 'cookie-parser';
import express from 'express';
import config from "./src/config/config.js";
import './src/config/instrument.js';
import { authenticate } from "./src/middlewares/authenticate.js";
import { corsMiddleware } from './src/middlewares/cors.js';
import { errorHandler } from './src/middlewares/errorHandler.js';
import { createAuthRouter } from './src/routes/authRouter.js';
import { createFollowRouter } from "./src/routes/followRouter.js";
import { createItinerariesRouter } from "./src/routes/itinerariesRouter.js";
import { createItineraryRouter } from './src/routes/itineraryRouter.js';
import { createUsersRouter } from './src/routes/usersRouter.js';

const app = express();

app.use(corsMiddleware());
app.use(express.json());
app.disable('x-powered-by');
app.use(cookieParser())

app.use('/itinerary', createItineraryRouter());
app.use('/users', authenticate, createUsersRouter());
app.use('/users', createFollowRouter());
app.use('/auth', createAuthRouter());
app.use('/itineraries', createItinerariesRouter())

app.use('/api', (req, res) => {
    res.status(200).json({ message: 'API is running' });
});

Sentry.setupExpressErrorHandler(app);

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler)

app.listen(config.port, () => {
    console.log(`Server running at http://localhost:${config.port}`);
});
