import type { NextFunction, Request, Response } from 'express';

import { getAuthenticatedUser, getBearerToken } from './auth.utils';

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = getBearerToken(req);

  if (!token) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  try {
    const user = await getAuthenticatedUser(token);

    if (!user) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    req.user = user;

    next();
  } catch {
    return res.status(401).json({
      message: 'Invalid token',
    });
  }
}
