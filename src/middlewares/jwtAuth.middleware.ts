import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req:Request, res:Response, next:NextFunction) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).send({
      result: false,
      message: 'Unauthorized',
    });
  }

  try {
    // check if the token is valid
    const payload = jwt.verify(token, 'WG6oqviIhVwcCJKY1ZI5G0NKnaTB5uYb');
    req.user = payload;
  } catch (e) {
    console.log(e);
    return res.status(401).send({
      result: false,
      message: 'Unauthorized',
    });
  }
  next();
};
