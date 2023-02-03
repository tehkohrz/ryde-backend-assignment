import User from '../model/UserModel.js';
import { HTTPException } from './errorHandler.js';
import calculatePagination from './helpers.js';

async function getAllUserController(req, res) {
  // Get total documents to check total pages
  const totalCount = await User.count();
  // Offset value (number of documents to skip) for pagination
  const { offSet, pageLimit } = calculatePagination(req.query, totalCount);
  const allUsers = await User.find().limit(pageLimit).skip(offSet);
  res.status(200).json(allUsers);
}
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

export {
  getAllUserController,
  getUserController,
  deleteUserController,
  updateUserController,
  createUserController,
};
