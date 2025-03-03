import { log } from './logger.js';

// Custom error types
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

// Error response formatter
export const formatErrorResponse = (error: Error): Record<string, unknown> => {
  if (error instanceof AppError) {
    return {
      status: 'error',
      message: error.message,
      ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
    };
  }
  
  // For unknown errors, provide a generic message in production
  return {
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : error.message,
    ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
  };
};

// Global error handler for uncaught exceptions and unhandled rejections
export const setupGlobalErrorHandlers = (): void => {
  // Handle uncaught exceptions
  process.on('uncaughtException', (error: Error) => {
    log.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', { error: error.message, stack: error.stack });
    process.exit(1);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason: Error) => {
    log.error('UNHANDLED REJECTION! 💥 Shutting down...', { error: reason.message, stack: reason.stack });
    process.exit(1);
  });
};
