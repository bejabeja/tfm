import express from 'express';
import { corsMiddleware } from './src/middlewares/cors.js';
import { ItineraryModel } from './src/models/itineraryModel.js';
import { createItineraryRouter } from './src/routes/itineraryRouter.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(corsMiddleware());
app.use(express.json());

app.disable('x-powered-by');

const itineraryModel = new ItineraryModel();
app.use('/itineraries', createItineraryRouter(itineraryModel));

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
