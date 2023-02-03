import express from 'express';
import mongoose from 'mongoose';
import {
  getAllUserController,
  getUserController,
  deleteUserController,
  updateUserController,
  createUserController,
} from './controllers/user_controllers.js';
import { routeErrorHandler } from './controllers/errorHandler.js';

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

    // GET specific user based on id
    app.get('/users/:id', routeErrorHandler(getUserController));

    // CREATE new user
    app.post('/users', routeErrorHandler(createUserController));

    // UPDATE User based on user id
    app.put('/users/:id', routeErrorHandler(updateUserController));

    // DELETE Route to delete user based on user id
    app.delete('/users/:id', routeErrorHandler(deleteUserController));

    app.listen(3000);
  } catch (err) {
    // Any errors resulting in fatal app intialisation should be implemented here
    console.log('Fatal App Init Error:', err);
  }
};
main();
