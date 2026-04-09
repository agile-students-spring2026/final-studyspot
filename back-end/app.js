import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import spotsRouter from './routes/spots.js';

dotenv.config();

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
// TODO: wire additional routers here (e.g. authRouter)

import usersRouter from './routes/users.js';
import savedRouter from './routes/saved.js';
import { destroySession } from './utils/session.js';
import authMiddleware from './middleware/auth.js';

app.use('/api/users', usersRouter);
app.use('/api/users', savedRouter);

// POST /api/auth/signout — log out current user
app.post('/api/auth/signout', authMiddleware, (req, res) => {
  const token = req.headers['authorization'].split(' ')[1];
  destroySession(token);
  res.json({ message: 'Logged out.' });
});

// ── File uploads ──────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const basenameWithoutExtension = path.basename(file.originalname, extension);
    const newName = `${basenameWithoutExtension}-${Date.now()}${Math.random()}${extension}`;
    cb(null, newName);
  },
});
const upload = multer({ storage });

export default app;