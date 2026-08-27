import * as Sentry from "@sentry/node";
import cookieParser from 'cookie-parser';
import express from 'express';
import config from "./src/config/config.js";
import './src/config/instrument.js';
import { testConnection } from "./src/db/clientPostgres.js";
import { authenticate } from "./src/middlewares/authenticate.js";
import { corsMiddleware } from './src/middlewares/cors.js';
import { errorHandler } from './src/middlewares/errorHandler.js';
import { createAuthRouter } from './src/routes/authRouter.js';

import { createEmailRouter } from './src/routes/emailRouter.js';
import { createCommentsRouter } from "./src/routes/commentsRouter.js";
import { createNotificationsRouter } from "./src/routes/notificationsRouter.js";
import { createFavoritesRouter } from "./src/routes/favoritesRouter.js";
import { createLikesRouter } from "./src/routes/likesRouter.js";
import { createFollowRouter } from "./src/routes/followRouter.js";
import { healthCheckRouter } from './src/routes/healthCheckRouter.js';
import { createItinerariesRouter } from "./src/routes/itinerariesRouter.js";
import { createUsersRouter } from './src/routes/usersRouter.js';
import { createOgRouter } from './src/routes/ogRouter.js';
import { createSitemapRouter } from './src/routes/sitemapRouter.js';
import { createVanLogsRouter } from './src/routes/vanLogsRouter.js';
import { createSuppliesRouter } from './src/routes/suppliesRouter.js';

const app = express();

// Behind Vercel's edge network, so req.ip needs the first X-Forwarded-For hop
// to reflect the real visitor instead of Vercel's own infra address.
app.set('trust proxy', true);

app.use(corsMiddleware());
app.use(express.json());
app.disable('x-powered-by');
app.use(cookieParser())

app.use('/users', createUsersRouter());
app.use('/users', authenticate, createFollowRouter());
app.use('/auth', createAuthRouter());
app.use('/itineraries', createItinerariesRouter());
app.use('/favorites', authenticate, createFavoritesRouter());
app.use('/likes', authenticate, createLikesRouter());
app.use('/comments', createCommentsRouter());
app.use('/notifications', authenticate, createNotificationsRouter());
app.use('/van-logs', authenticate, createVanLogsRouter());
app.use('/supplies', authenticate, createSuppliesRouter());

app.use('/', createEmailRouter());
if (config.nodeEnv !== 'production') {
    const { createDevRouter } = await import('./src/routes/devRouter.js');
    app.use('/dev', createDevRouter());
}
app.use('/og', createOgRouter());
app.use('/', createSitemapRouter());
app.use('/api', healthCheckRouter());

Sentry.setupExpressErrorHandler(app);

app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler)

app.listen(config.port, async () => {
    console.log(`Server running on port ${config.port}`);
    await testConnection();
});

// export default app;