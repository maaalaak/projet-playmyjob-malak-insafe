import express, { type Express } from 'express';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.ts';
import { apiTestRouter } from './routes/api-test.routes.ts';
import { favoriteRouter } from './routes/favorite.routes.ts';
import { simulationTestRouter } from './routes/simulation-test.routes.ts';

export const app: Express = express();

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/test/favorites', favoriteRouter);
app.use('/api/test/simulation', simulationTestRouter);
app.use('/api/test', apiTestRouter);

app.use(notFoundHandler);
app.use(errorHandler);
