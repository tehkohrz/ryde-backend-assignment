import express from 'express';
import mongoose from 'mongoose';
import User from './model/UserModel.js';

const MONGO_URI =
  'mongodb+srv://ryde-user:yGOiedfpWhoKhSf1@personaldev.3tzwrzd.mongodb.net/ryde-assignment';

const main = async () => {
  try {
    // Connect to MongoDB
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGO_URI);
    // Initialise express
    const app = express();
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    // User Routes
    // GET all users in the collection up to a limit of 10
    app.get('/users', routeErrorHandler(getAllUserController));
    async function getAllUserController(req, res) {
      // Get total documents to check total pages
      const totalCount = await User.count();
      // Offset value (number of documents to skip) for pagination
      const { offSet, pageLimit } = calculatePagination(req.query, totalCount);
      const allUsers = await User.find().limit(pageLimit).skip(offSet);
      res.status(200).json(allUsers);
    }

    // GET specific user based on id
    app.get('/users/:id', routeErrorHandler(getUserController));
    async function getUserController(req, res) {
      const { id } = req.params;
      // Id params not valid return not found throw http exception
      // Valid id is ObjectId type/ 24 characters in length
      if (id.length !== 24) {
        throw new HTTPException('Request invalid', 400, 'User ID is invalid.');
      }
      const requestedUser = await User.findById(id);
      // No matching id found
      if (requestedUser === null) {
        throw new HTTPException(
          'No user found',
          404,
          `No user matching the ID ${id}.`,
        );
      }
      // Matching user found and returned
      res.status(200).json(requestedUser);
    }

    // CREATE new user
    app.post('/users', routeErrorHandler(createUserController));
    async function createUserController(req, res) {
      const newUser = req.body;
      // No data recieved within the request body
      if (!newUser) {
        throw new HTTPException(
          'No user information recieved.',
          400,
          'Request invalid as no user information received to be posted.',
        );
      }
      // Mongoose validation will throw a mongoose error
      const createdUser = await User.create(newUser);
      // Returns new user with allocated _id to the cilent
      res.status(201).json(createdUser);
      // }
    }

    // UPDATE User based on user id
    app.put('/users/:id', routeErrorHandler(updateUserController));
    async function updateUserController(req, res) {
      const { id } = req.params;
      const userData = req.body;
      // Id params not valid return not found throw http exception
      // Valid id is ObjectId type/ 24 characters in length
      if (id.length !== 24) {
        throw new HTTPException('Request invalid', 400, 'User ID is invalid.');
      }
      // No user data received
      if (!userData) {
        throw new HTTPException(
          'No user information recieved.',
          400,
          'Request invalid as no user information received to be posted.',
        );
      }
      // Cilent has to send full User schema to ensure valid update
      // runValidators option not working in the update method
      await User.validate(userData);
      const updatedUser = await User.findByIdAndUpdate(id, userData, {
        returnDocument: 'after',
      });
      // Returns updated document to the cilent
      res.status(200).json(updatedUser);
    }

    // DELETE Route to delete user based on user id
    app.delete('/users/:id', routeErrorHandler(deleteUserController));
    async function deleteUserController(req, res) {
      const { id } = req.params;
      // Id params not valid return not found throw http exception
      // Valid id is ObjectId type/ 24 characters in length
      // if (id.length !== 24) {
      //   throw new HTTPException('Request invalid', 400, 'User ID is invalid.');
      // }
      const deletedUser = await User.findByIdAndDelete(id);
      // Invalid query ie user id does not exist will return null from DB
      if (deletedUser === null) {
        throw new HTTPException(
          'User ID not found.',
          404,
          `The User Id: ${id} cannot be found.`,
        );
      }
      // Return deleted user details
      res.status(200).json(deletedUser);
    }
    app.listen(3000);
  } catch (err) {
    // Logging for analytics of app error should be implemented here
    console.log('Fatal App Init Error:', err);
  }
};
main();

class HTTPException extends Error {
  constructor(name, statusCode, message) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}

// Pagination function to calculate record offset and retrieve limit
// Checks of invalid page numbers
function calculatePagination(query, totalCount) {
  // Query params for current page and document limit
  // Default page of 1 and limit of 10
  const currentPage = query.page ? query.page : 1;
  const pageLimit = query.limit ? query.limit : 10;
  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageLimit);
  // Checking for negative page numbers
  //! test for over page
  if (currentPage < 1 || currentPage > totalPages) {
    throw new HTTPException(
      'Invalid page number.',
      400,
      `Page number ${currentPage} does not exist`,
    );
  }
  const offSet = (currentPage - 1) * pageLimit;
  return { offSet, pageLimit };
}

function routeErrorHandler(routeController) {
  return async (req, res, next) => {
    try {
      await routeController(req, res, next);
    } catch (err) {
      // Error is a case of known exception return the error to the cilent
      if (err instanceof HTTPException) {
        res.send(err.statusCode).json(err);
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
        res.send(errorResponse.statusCode).json(errorResponse);
      } else if (err instanceof mongoose.Error.CastError) {
        const message = `Field (${err.kind}): ${err.reason.message}`;

        res.status(400).json(message);
      } else {
        // Any unanticipated errors are caught and return as 500 internal server error
        const message = 'Something went wrong!';
        res.status(500).json({ message });
      }
    }
  };
}
