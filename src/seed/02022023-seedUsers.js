import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../model/UserModel.js';

dotenv.config();
const mongoURI = process.env.MONGODB_URI;

async function seedUsers() {
  try {
    // Connect to mongoDB
    mongoose.set('strictQuery', true); // suppress depreciation warning
    // const conn = await mongoose
    //   .createConnection(mongoURI, { dbName: 'ryde-assignment' })
    //   .asPromise();
    await mongoose.connect(mongoURI, { dbName: 'ryde-assignment' });
    console.log('Mongo connected');
    // Drop existing collection
    // Generate 10 seed Users
    const seedUsers = [];
    for (let i = 0; i < 10; i += 1) {
      const newUser = {
        name: faker.name.fullName(),
        dob: faker.date.birthdate({ min: 1900, max: 2020, mode: 'year' }),
        address: faker.address.cityName(),
        description: faker.lorem.lines(),
      };
      seedUsers.push(newUser);
    }
    await User.insertMany(seedUsers);
    console.log('Users seeded.');
    mongoose.disconnect();
  } catch (err) {
    console.log('Error seeding users: ', err);
    mongoose.disconnect();
  }
}
seedUsers();
