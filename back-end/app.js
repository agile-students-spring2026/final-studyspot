import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import spotsRouter from './routes/spots.js';
import usersRouter from './routes/users.js';
import savedRouter from './routes/saved.js';
import authRouter from './routes/auth.js';
import notificationsRouter from './routes/notifications.js';
import { destroySession } from './utils/session.js';
import authMiddleware from './middleware/auth.js';


dotenv.config();

mongoose
  .connect(process.env.DB_CONNECTION_STRING)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static('public'));

// ── Routes ───────────────────────────────────────────────────────────────────
// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'StudySpot API' });
});

app.use('/api/studyspots', spotsRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/users', savedRouter);
app.use('/api/users', notificationsRouter);

// POST /api/auth/signout — log out current user
app.post('/api/auth/signout', authMiddleware, (req, res) => {
  const token = req.headers['authorization'].split(' ')[1];
  destroySession(token);
  res.json({ message: 'Logged out.' });
});

export default app;
