import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
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
    app.use(cors());

    // User Routes
    // Get all users in the collection up to a limit of 10
    app.get('/users', getAllUserController);
    async function getAllUserController(req, res) {
      // Query params for current page and document limit
      // Default page of 1 and limit of 10
      const currentPage = req.query.page ? req.query.page : 1;
      const recordLimit = req.query.limit ? req.query.limit : 10;
      // Offset value for pagination
      const offSet = (currentPage - 1) * recordLimit;
      const allUsers = await User.find().limit(recordLimit).skip(offSet);
      res.status(200).json(allUsers);
    }

    app.listen(3000);
  } catch (err) {
    console.log('App error:', err);
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
