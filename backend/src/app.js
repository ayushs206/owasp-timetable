import express from 'express';
import cors from 'cors';

const app = express();

const allowedOrigins = process.env.CORS_URLS
    ? process.env.CORS_URLS.split(',')
    : ['http://localhost:3000', 'http://localhost:3001'];

const restrictedCors = cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import { limiter } from './middleware/ratelimit.js';

/* IMPORT ROUTE FILES HERE */
import healthRoute from './routes/health.route.js';
import timetableRoute from './routes/timetable.route.js';

/* USE ROUTES HERE */
app.use('/api/v1/health', healthRoute);
app.use(limiter);
app.use('/api/v1/timetable', restrictedCors, timetableRoute);

app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

export default app;