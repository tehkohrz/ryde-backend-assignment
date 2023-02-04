import mongoose from 'mongoose';
import HTTPException from './HTTPException.js';

function routeErrorHandler(routeController) {
  return async (req, res, next) => {
    try {
      await routeController(req, res, next);
    } catch (err) {
      // Error is a case of known exception return the error to the cilent
      if (err instanceof HTTPException) {
        res.status(err.statusCode).json(err);
      }
      // Mongoose validation error, form the exception message for the cilent
      else if (err instanceof mongoose.Error.ValidationError) {
        const fields = Object.keys(err.errors);
        const errorMsg = [];
        fields.forEach(field => {
          errorMsg.push(err.errors[field]?.message);
        });
        const errorResponse = new HTTPException(
          'Input validation failed',
          400,
          errorMsg.join('\n'),
        );
        res.status(errorResponse.statusCode).json(errorResponse);
      } else if (err instanceof mongoose.Error.CastError) {
        const message = `Field (${err.kind}): ${err.reason.message}`;

        res.status(400).json(message);
      } else {
        // Any unanticipated errors are caught and return as 500 internal server error
        // These errors should be logged for further investigation and alert the devs.
        const message = 'Something went wrong!';
        res.status(500).json({ message });
      }
    }
  };
}

export default routeErrorHandler;
