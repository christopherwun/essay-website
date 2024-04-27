import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import accRouter from './routes/account';
import eRouter from './routes/essays';
import cors from 'cors';
import { Server } from 'socket.io';

import { createServer } from 'node:http';

// read environment variables from .env file
dotenv.config();
const PORT = process.env.PORT ?? 8000;

const app = express();
const server = createServer(app); // Create HTTP server using Express app
const io = new Server(server); // Create Socket.IO server

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
  // origin is localhost:3000
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow only GET, POST, PUT, DELETE requests
  allowedHeaders: ['Content-Type'],
  credentials: true // Allow cookies to be sent with requests
  // credentials: true, // Allow credentials (cookies)
};
app.use(cors(corsOptions));
// app.use(cors());


// define root route
app.get('/api/hello', (_, res) => {
  res.json({ message: 'Hello, frontend!' });
});

// add account routes
app.use('/api/account', accRouter);

// add question routes
app.use('/api/essays', eRouter);

// define error handler
function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.log(err.stack); // log the error for debugging purposes
  res.status(500).json({ message: err.message });
  next();
}
app.use(errorHandler);

console.log('setting up socket.io');
io.on('connection', (socket) => {
  io.emit('connected', 'a user connected');
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('essaysUpdated', (msg, id) => {
    console.log('updated essays');
    io.emit('essaysUpdated', msg, id);
  });

  socket.on('hello', (msg) => {
    console.log('message: ' + msg);
  });
});

// listen
server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Now listening on port ${PORT}.`);
});
