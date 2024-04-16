import express from 'express';
import Essay from '../models/essay';
import User from '../models/user';
import requireAuth from '../middlewares/require-auth';
import OpenAI from 'openai';
import dotenv from 'dotenv';

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

eRouter.post('/feedback', requireAuth, async (req, res, next) => {
  try {
    // Get the essay from the database
    const essay = await Essay.findById(req.body._id).exec();
    if (!essay) {
      res.status(404).json({ message: 'Essay not found' });
      next();
      return;
    }

    // Use OpenAI to generate feedback
    const chatPrompt = `Feedback on the essay: ${  essay.essayText  }, prompt: ${  essay.prompt}`;
    const feedback = await openai.chat.completions.create({
      messages: [{ role: 'user', content: chatPrompt }],
      model: 'gpt-3.5-turbo-0125',
    });
    if (!feedback.choices || feedback.choices.length === 0) {
      res.status(500).json({ message: 'Error getting feedback' });
      next();
      return;
    } else if (!feedback.choices[0].message || !feedback.choices[0].message.content) {
      res.status(500).json({ message: 'Error getting feedback' });
      next();
      return;
    }

    // Save the feedback to the database
    essay.feedback = feedback.choices[0].message.content;
    await essay.save();
    res.status(200).json({ message: 'Feedback added' });
    next();

  } catch (err) {
    res.status(400).json({ message: 'Feedback not added' });
    // console.error(err);
    next(err);
  }
});

export default eRouter;
