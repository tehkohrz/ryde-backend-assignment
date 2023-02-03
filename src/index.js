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
    app.get('/users', getAllUserController);
    async function getAllUserController(req, res) {
      // Get total documents to check total pages
      const totalCount = await User.count();
      // Offset value (number of documents to skip) for pagination
      const { offSet, pageLimit } = calculatePagination(req.query, totalCount);
      const allUsers = await User.find().limit(pageLimit).skip(offSet);
      res.status(200).json(allUsers);
    }

    // GET specific user based on id
    app.get('/users/:id', getUserController);
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
