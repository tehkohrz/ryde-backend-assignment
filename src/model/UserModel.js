import mongoose from 'mongoose';

// Defining schema of User model
/*
REQUIRED FIELDS: name, createdAt, address - minimal name field required for a profile and address for advance requirement
  {
  "id": "xxx", // MongoDB has a self-generated key "_id" which uniquely identifies each document, 
  this can be used in place of id. Alternatively, uuid can be generated to not rely on specfic DB.
  "name": "test", // user name - type: String, not required to be unique as people can have the same name
  "dob": "", // date of birth - 
  "address": "", // user address
  "description": "", // user description
  "createdAt": "" // user created date
  }
*/
const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required.'] },
  dob: { type: Date, max: [Date.now(), 'Date of birth cannot be later than today.'] },
  address: { type: String, required: [true, 'Address is required.'] },
  description: { type: String },
  createdAt: { type: Date, default: Date.now() },
});
const User = mongoose.model('User', userSchema);

export default User;
