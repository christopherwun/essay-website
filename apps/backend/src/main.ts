import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import accRouter from './routes/account';
import eRouter from './routes/essays';
import cors from 'cors';

// read environment variables from .env file
dotenv.config();
const PORT = process.env.PORT ?? 8000;

const app = express();

// connect to MongoDB
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
mongoose.connect(MONGO_URI);

// add the body-parser middleware to server
app.use(express.json());

// add cookie-session middleware to server
app.use(
  cookieSession({
    name: 'session',
    keys: ['secret'],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/', // Set the path to '/' to make the cookie accessible from the entire domain
    domain: 'localhost', // Set the domain to make the cookie accessible from all subdomains
  }),
);

// add middleware to set CORS headers
const corsOptions = {
  origin: 'http://localhost:3000', // Specify the exact origin
  credentials: true, // Allow credentials (cookies)
};
app.use(cors(corsOptions));

// define root route
app.get('/api/hello', (_, res) => {
  res.json({ message: 'Hello, frontend!' });
});

// add account routes
app.use('/api/account', accRouter);

// add question routes
app.use('/api/essays', eRouter);

// define error handler
function errorHandler(err, req, res) {
  // eslint-disable-next-line no-console
  console.log(err.stack); // log the error for debugging purposes
  res.status(err.status || 500).json({ error: err.message });
}
app.use(errorHandler);

// listen
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Now listening on port ${PORT}.`);
});
