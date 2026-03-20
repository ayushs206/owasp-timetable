import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* IMPORT ROUTE FILES HERE */
import healthRoute from './routes/health.route.js';
import timetableRoute from './routes/timetable.route.js';

/* USE ROUTES HERE */
app.use('/api/v1/health', healthRoute);
app.use('/api/v1/timetable', timetableRoute);

export default app;