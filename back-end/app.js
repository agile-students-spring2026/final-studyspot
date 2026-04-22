import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import spotsRouter from './routes/spots.js';
import usersRouter from './routes/users.js';
import savedRouter from './routes/saved.js';
import authRouter from './routes/auth.js';
import { destroySession } from './utils/session.js';
import { MOCK_SPOTS, buildNewSpot } from './data/mockSpots.js';
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

app.post('/api/studyspots', authMiddleware, upload.single('image'), (req, res) => {
  const { spotName, address, hours, description } = req.body;
  if (!spotName || !address || !hours || !description) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  let parsedHours;
  try {
    parsedHours = JSON.parse(hours);
  } catch {
    return res.status(400).json({ error: 'Invalid hours format. Expected JSON.' });
  }
  if (!Array.isArray(parsedHours) || parsedHours.length === 0) {
    return res.status(400).json({ error: 'Hours must be a non-empty array.' });
  }
  for (const entry of parsedHours) {
    if (!entry.day || typeof entry.day !== 'string') {
      return res.status(400).json({ error: 'Each hours entry must have a day.' });
    }
    if (typeof entry.time !== 'string') {
      return res.status(400).json({ error: `Missing time for ${entry.day}.` });
    }
  }

  const newSpot = buildNewSpot({ spotName, address, hours: parsedHours, description }, req.file?.filename);
  MOCK_SPOTS.push(newSpot);
  res.status(201).json(newSpot);
});

app.use('/api/studyspots', spotsRouter);
// TODO: wire additional routers here (e.g. authRouter)
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/users', savedRouter);

// POST /api/auth/signout — log out current user
app.post('/api/auth/signout', authMiddleware, (req, res) => {
  const token = req.headers['authorization'].split(' ')[1];
  destroySession(token);
  res.json({ message: 'Logged out.' });
});

export default app;