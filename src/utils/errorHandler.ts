import { Request, Response, NextFunction } from 'express';
import { GraphQLError } from 'graphql';
import logger from './logger';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Express Error Middleware
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`[${req.method}] ${req.url} - ${message}`);
  res.status(status).json({ success: false, message });
};

// GraphQL Error Formatter
export const graphqlErrorFormatter = (error: GraphQLError) => {
  logger.error(`GraphQL Error: ${error.message}`);
  return {
    message: error.message,
    locations: error.locations,
    path: error.path,
  };
};
