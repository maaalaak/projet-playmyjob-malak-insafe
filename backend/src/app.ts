import express, { type Express } from 'express';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.ts';
import { authRouter } from './routes/auth.routes.ts';
import { favoriteRouter } from './routes/favorite.routes.ts';
import { offerRouter } from './routes/offer.routes.ts';
import { profileRouter } from './routes/profile.routes.ts';
import { simulationRouter } from './routes/simulation.routes.ts';

export const app: Express = express();

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/offers', offerRouter);
app.use('/api/favorites', favoriteRouter);
app.use('/api/profile', profileRouter);
app.use('/api/simulations', simulationRouter);

app.use(notFoundHandler);
app.use(errorHandler);
