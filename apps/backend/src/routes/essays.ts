import express from 'express';
import Essay from '../models/essay';
import User from '../models/user';
import requireAuth from '../middlewares/require-auth';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import io from 'socket.io-client';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const eRouter = express.Router();

// Get all essay from a user
eRouter.get('/', requireAuth, async (req, res, next) => {
  try {
    const user = req.session!.user;
    const userDoc = await User.findOne({ username: user });
    if (!userDoc) {
      res.status(404).json({ message: 'User not found' });
      next();
      return;
    }
    const essays = await Essay.find({ user: userDoc.username });
    res.status(200).json(essays);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching questions' });
    // console.error(err);
    next(err);
  }
});

// Get essay by id
eRouter.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const essay = await Essay.findById(req.params.id);
    if (!essay) {
      res.status(404).json({ message: 'Essay not found' });
      next();
      return;
    }
    res.status(200).json(essay);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching essay' });
    next(err);
  }
});

eRouter.post('/add', requireAuth, async (req, res, next) => {
  try {
    // First, save the essay to the database
    const user = req.session!.user;
    const essay = new Essay({
      essayText: req.body.essayText,
      prompt: req.body.prompt,
      feedback: '',
      user,
    });
    await essay.save();

    // Emit an 'essaysUpdated' event to all connected clients
    const essays = await Essay.find({ user });
    const socket = io('http://localhost:8000', { transports: ['websocket'] });
    socket.emit('essaysUpdated', essays, essay._id);

    // Then, update the user's essays array
    const userDoc = await User.findOne({ username: user });
    if (!userDoc) {
      res.status(404).json({ message: 'User not found' });
      next();
      return;
    }
    userDoc.essays.push(essay._id.toString());
    await userDoc.save();

    res.status(201).json({ message: 'Essay saved' });
    next();
  } catch (err) {
    res.status(400).json({ message: 'Essay not saved' });
    next(err);
  }
});

eRouter.post('/edit/:id', requireAuth, async (req, res, next) => {
  try {
    // Get the essay ID from the route parameters
    const essayId = req.params.id;
    console.log(essayId);

    // Get the essay from the database
    const essay = await Essay.findById(essayId).exec();
    if (!essay) {
      res.status(404).json({ message: 'Essay not found' });
      return;
    }

    // Update the essay text
    essay.essayText = req.body.essayText;
    await essay.save();
    res.status(200).json({ message: 'Essay updated' });

    // Emit an 'essaysUpdated' event to all connected clients
    const user = req.session!.user;
    const essays = await Essay.find({ user });
    const socket = io('http://localhost:8000', { transports: ['websocket'] });
    socket.emit('hello', 'hello from backend');
    socket.emit('essaysUpdated', essays, essayId);
  } catch (err) {
    res.status(400).json({ message: 'Essay not updated' });
    next(err);
  }
});

eRouter.post('/feedback/:id', requireAuth, async (req, res, next) => {
  try {
    // Get the essay ID from the route parameters
    const essayId = req.params.id;

    // Get the essay from the database
    const essay = await Essay.findById(essayId).exec();
    if (!essay) {
      res.status(404).json({ message: 'Essay not found' });
      return;
    }

    // Use OpenAI to generate feedback
    let chatPrompt = `Feedback on the essay: ${essay.essayText}. The prompt was: ${essay.prompt}.`;
    chatPrompt +=
      'Make exactly 1 positive comment and up to 5 negative comments.';
    chatPrompt +=
      'Be sure to provide feedback on the essay, make sure it has sufficient length and detail.';
    const feedback = await openai.chat.completions.create({
      messages: [{ role: 'user', content: chatPrompt }],
      model: 'gpt-3.5-turbo-0125',
    });
    if (!feedback.choices || feedback.choices.length === 0) {
      res.status(500).json({ message: 'Error getting feedback' });
      return;
    } else if (
      !feedback.choices[0].message ||
      !feedback.choices[0].message.content
    ) {
      res.status(500).json({ message: 'Error getting feedback' });
      return;
    }

    // Save the feedback to the database
    essay.feedback = feedback.choices[0].message.content;
    await essay.save();
    res.status(200).json({ message: 'Feedback added' });

    // Emit an 'essaysUpdated' event to all connected clients
    const user = req.session!.user;
    const essays = await Essay.find({ user });

    const socket = io('http://localhost:8000', { transports: ['websocket'] });
    socket.emit('hello', 'hello from backend');
    socket.emit('essaysUpdated', essays, essayId);
  } catch (err) {
    res.status(400).json({ message: 'Feedback not added' });
    next(err);
  }
});

export default eRouter;
