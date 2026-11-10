import { JWT_SECRET } from '../config/utils.js';
import { ApiError } from '../utils/api-error.js';
import { HTTP_STATUS, RESPONSE_MESSAGES } from '../utils/constants.js';
import jwt from 'jsonwebtoken';
import { Role } from '../types/role-type.js';
import User from '../models/user.js';

import { Request, Response, NextFunction } from 'express';

interface JwtPayload {
  _id: string;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.access_token;

  // Check whether the access token exists
  if (!token) {
    return next(
      new ApiError({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: RESPONSE_MESSAGES.USERS.RE_LOGIN,
      })
    );
  }

  let decoded: JwtPayload;

  // Verify JWT token
  try {
    decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;

    if (!decoded._id) {
      return next(
        new ApiError({
          status: HTTP_STATUS.FORBIDDEN,
          message: RESPONSE_MESSAGES.USERS.INVALID_TOKEN,
        })
      );
    }
  } catch (error) {
    return next(
      new ApiError({
        status: HTTP_STATUS.FORBIDDEN,
        message: RESPONSE_MESSAGES.USERS.INVALID_TOKEN,
      })
    );
  }

  // Find the user associated with the token
  try {
    const user = await User.findById(decoded._id);

    if (!user) {
      return next(
        new ApiError({
          status: HTTP_STATUS.UNAUTHORIZED,
          message: RESPONSE_MESSAGES.USERS.RE_LOGIN,
        })
      );
    }

    // Attach authenticated user to request
    req.user = user;

    return next();
  } catch (error) {
    return next(error);
  }
};

// Admin authorization middleware
export const isAdminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const role = req.user?.role;

  if (role !== Role.Admin) {
    return next(
      new ApiError({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: RESPONSE_MESSAGES.USERS.UNAUTHORIZED_USER,
      })
    );
  }

  return next();
};
