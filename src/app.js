import express from 'express';
import leadRoutes from './routes/leadRoutes.js';
import bodyParser from 'body-parser';


const app = express();
app.use(bodyParser.json());

// Routes
app.use('/api/leads', leadRoutes);

export default app;
