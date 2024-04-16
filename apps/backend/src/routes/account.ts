import express from 'express';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import requireAuth from '../middlewares/require-auth';

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
    // Check if already logged in
    if (req.session!.user) {
      res.status(400).json({ message: 'Already logged in' });
      next();
      return;
    }
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
