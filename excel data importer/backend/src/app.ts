import express from 'express';
import cors from 'cors';
import uploadRoutes from './routes/uploadRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

// Mount the routes at /api
app.use('/api', uploadRoutes);

// Global error handler
app.use(errorHandler);

export default app;
