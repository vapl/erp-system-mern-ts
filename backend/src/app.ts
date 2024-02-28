import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
// import notesRoutes from './routes/notes.routes';
import userRoutes from './routes/userRoutes';
import orderRegRoutes from './routes/orderRegRoutes';
import morgan from 'morgan';
import session from 'express-session';
import env from './util/validateEnv';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import createHttpError from 'http-errors';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ["Content-Type, Authorization"],
}));

app.use(morgan('dev')); 

app.use(express.json());

app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.MONGO_CONNECTION_STRING,
        ttl: 60 * 60,
    })
}));

app.use('/api/users', userRoutes);
// app.use('/api/notes', notesRoutes);
app.use('/api/orders', orderRegRoutes);
app.use('/api/download', orderRegRoutes);

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = 'An unknown error occured';
    if (error instanceof Error) errorMessage = error.message;
    res.status(500).json({ error: errorMessage });
});

export default app;