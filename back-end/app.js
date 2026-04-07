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