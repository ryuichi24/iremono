import express from 'express';
import { loggerFactory } from './shared/utils/logger';

const logger = loggerFactory.createLogger('main');

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || '4000';

const app = express();

app.use([express.json()]);

app.get('/api/health', async (_, res) => res.send('API is running'));

app.listen(PORT, () => logger.info(`Server is running at http://${HOST}:${PORT}`));
