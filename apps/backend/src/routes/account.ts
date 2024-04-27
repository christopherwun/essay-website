import express from 'express';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import requireAuth from '../middlewares/require-auth';
import Essay from '../models/essay';

const accRouter = express.Router();

accRouter.post('/signup', async (req, res, next) => {
  try {
    // See if user already exists
    const existing = await User.findOne({ username: req.body.username });
    if (existing) {
      res.status(400).json({ message: 'User already exists' });
      next();
      return;
    }
    // Create new user if not
    const user = new User({
      username: req.body.username,
      password: await bcrypt.hash(req.body.password, 10),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      admin: req.body.admin,
      email: req.body.email,
      essays: [],
    });

    // Add the default essay prompts (10 of them)
    const defaultEssays = [
      'What is your favorite book?',
      'What is your favorite movie?',
      'What is your favorite song?',
      'What is your favorite food?',
      'What is your favorite color?',
      'What is your favorite animal?',
      'What is your favorite sport?',
      'What is your favorite hobby?',
      'What is your favorite place to visit?',
      'What is your favorite thing to do?',
    ];

    // Make essay objects and save them to the database
    for (const prompt of defaultEssays) {
      const essay = new Essay({
        essayText: '',
        prompt,
        feedback: '',
        user: req.body.username,
      });
      await essay.save();
      user.essays.push(essay._id);
    }

    // Save user to database
    await user.save();
    res.status(201).json({ message: 'User created' });
    next();
  } catch (err) {
    res.status(400).json({ message: `User not created: ${  err}` });
    // console.error(err);
    next(err);
  }
});

accRouter.post('/login', async (req, res, next) => {
  try {
    // // Check if already logged in
    // if (req.session!.user) {
    //   // RETURN 200 OK
    //   res.status(200).json({ message: 'Already logged in' });
    //   next();     
    //   return;
    // }
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.status(401).json({ message: 'User does not exist' });
      next();
      return;
    }
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      res.status(402).json({ message: 'Incorrect password' });
      next();
      return;
    }
    req.session!.user = user.username;
    res.status(200).json({ message: 'Login successful' });
    next();
    
  } catch (err) {
    res.status(403).json({ message: 'Unauthorized' });
    // console.error(err);
    next(err);
  }
});

accRouter.post('/logout', requireAuth, (req, res, next) => {
  try {
    req.session!.user = '';
    res.status(200).json({ message: 'Logout successful' });
    next();
  } catch (err) {
    res.status(400).json({ message: 'Logout failed' });
    // console.error(err);
    next(err);
  }
});

accRouter.get('/user', requireAuth, (req, res, next) => {
  try {
    res.status(200).json({ username: req.session!.user });
    next();
  } catch (err) {
    res.status(400).json({ message: 'User not found' });
    // console.error(err);
    next(err);
  }
});

export default accRouter;
