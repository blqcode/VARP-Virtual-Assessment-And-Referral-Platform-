export class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = true;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export class ValidationError extends AppError {
    constructor(message) {
      super(message, 422);
    }
  }
  
  export class UnauthorizedError extends AppError {
    constructor(message) {
      super(message, 401);
    }
  }
  
  export class ForbiddenError extends AppError {
    constructor(message) {
      super(message, 403);
    }
  }
  
  export class NotFoundError extends AppError {
    constructor(message) {
      super(message, 404);
    }
  }
  
  export class ConflictError extends AppError {
    constructor(message) {
      super(message, 409);
    }
  }