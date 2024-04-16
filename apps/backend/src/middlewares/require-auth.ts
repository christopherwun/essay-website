// Let's implement a middleware function called requireAuth. The function checks to see if a user is defined in the session object (be careful here, you need to check for empty string here as well). If it is, then we allow the request to continue without any error parameters passed on (just by calling next()). Otherwise, we throw an error using next(...).

import { Request, Response, NextFunction } from 'express';

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session!.user || req.session!.user === '') {
    res.status(401);
    res.json({ message: 'Not logged in' });
    // next(new Error('Not logged in'));
  } else {
    next();
  }
}

export default requireAuth;
