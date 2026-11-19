// The Gradient API: stores a teacher's answer key so student work can be graded against it.
// Run with `npm run server` from the react folder. Needs MONGO_URI in react/.env (see .env.example).

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { mkdirSync } from 'node:fs';
import { MongoClient } from 'mongodb';
import multer from 'multer';

dotenv.config();

const PORT = Number(process.env.PORT ?? 5050);
const UPLOAD_FOLDER = './uploads';
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is missing. Copy .env.example to .env and add your connection string.');
  process.exit(1);
}

// One client for the whole server; the driver keeps a pool of connections inside it.
const mongo = new MongoClient(process.env.MONGO_URI);
const answerKeys = mongo.db('hackohio').collection('answerKeys');

mkdirSync(UPLOAD_FOLDER, { recursive: true });
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_FOLDER,
    filename: (req, file, done) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      done(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
    },
  }),
  limits: { fileSize: MAX_UPLOAD_BYTES },
});

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('Gradient API is running');
});

app.post('/upload-answer-key', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }

  try {
    const { filename, path } = req.file;
    const result = await answerKeys.insertOne({ filename, filePath: path, uploadedAt: new Date() });
    res.json({ success: true, message: 'Answer key uploaded', data: result.insertedId });
  } catch (error) {
    console.error('Could not save the answer key:', error);
    res.status(500).json({ success: false, error: 'Could not save the answer key' });
  }
});

// Grading student submissions was planned for the hackathon but not finished.
// The route answers clearly instead of failing, so the app can say so.
app.post('/upload-student-submissions', (req, res) => {
  res.status(501).json({ success: false, error: 'Grading student work is not built yet.' });
});

async function start() {
  try {
    await mongo.connect();
    await mongo.db('hackohio').command({ ping: 1 });
  } catch (error) {
    console.error('Could not connect to MongoDB. Check MONGO_URI in .env.', error.message);
    process.exit(1);
  }

  const server = app.listen(PORT, () => {
    console.log(`Gradient API listening on http://localhost:${PORT}`);
  });

  // Close the database connection when the server is stopped (Ctrl+C).
  process.on('SIGINT', () => {
    server.close(() => mongo.close().then(() => process.exit(0)));
  });
}

start();
