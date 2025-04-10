import express from 'express';
import { corsMiddleware } from './src/middlewares/cors.js';
import { ItineraryRepository } from './src/repositories/itineraryRepository.js';
import { UserRepository } from './src/repositories/userRepository.js';
import { createItineraryRouter } from './src/routes/itineraryRouter.js';
import { createUserRouter } from './src/routes/userRouter.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(corsMiddleware());
app.use(express.json());
app.disable('x-powered-by');

const itineraryRepo = new ItineraryRepository();
const userRepo = new UserRepository();

app.use('/itinerary', createItineraryRouter(itineraryRepo));
app.use('/users', createUserRouter(userRepo));

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
