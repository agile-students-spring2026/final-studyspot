import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer'
const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static('public'));
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'StudySpot API' });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    // take apart the uploaded file's name so we can create a new one based on it
    const extension = path.extname(file.originalname)
    const basenameWithoutExtension = path.basename(file.originalname, extension)
    // create a new filename with a timestamp in the middle
    const newName = `${basenameWithoutExtension}-${Date.now()}${Math.random()}${extension}`
    // tell multer to use this new filename for the uploaded file
    cb(null, newName)
  },
})
const upload = multer({ storage })

export default app;