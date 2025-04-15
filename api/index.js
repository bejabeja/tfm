import * as Sentry from "@sentry/node";
import cookieParser from 'cookie-parser';
import express from 'express';
import './instrument.js';
import { authenticate } from './src/middlewares/authenticate.js';
import { corsMiddleware } from './src/middlewares/cors.js';
import { errorHandler } from './src/middlewares/errorHandler.js';
import { ItineraryRepository } from './src/repositories/itineraryRepository.js';
import { createAuthRouter } from './src/routes/authRouter.js';
import { createItineraryRouter } from './src/routes/itineraryRouter.js';
import { createUserRouter } from './src/routes/userRouter.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(corsMiddleware());
app.use(express.json());
app.disable('x-powered-by');
app.use(cookieParser())

const itineraryRepo = new ItineraryRepository();

app.use('/itinerary', createItineraryRouter(itineraryRepo));
app.use('/users', createUserRouter());
app.use('/auth', createAuthRouter());

app.use('/protected', authenticate, (req, res) => {
    const { user } = req.session;
    res.status(200).json({ message: `Hello ${user.username}` });
});

app.use('/api', (req, res) => {
    res.status(200).json({ message: 'API is running' });
});

Sentry.setupExpressErrorHandler(app);

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
