import { getMockReq, getMockRes } from '@jest-mock/express';
import HTTPException from '../controllers/HTTPException';
import {
  getUserController,
  createUserController,
  updateUserController,
  deleteUserController,
} from '../controllers/user_controllers.js';

import User from '../model/UserModel.js';

// Stub the DB model
jest.mock('../model/UserModel.js');

// Create a mock instance for User model
const mockUser = jest.mocked(User);

describe('User Controllers', () => {
  const { res, next, clearMockRes } = getMockRes();

  beforeEach(() => {
    mockUser.mockClear();
    clearMockRes();
  });
  describe('/users/:id - GET one user document base on User Id', () => {
    test('Not valid ID sent (length <24), should throw 400 HTTP exception for invalid ID.', () => {
      mockUser.findById.mockImplementation(() => null);
      const req = getMockReq({ params: { id: '12345612345612345612345' } });
      const expected = new HTTPException(
        'Request invalid',
        400,
        'User ID is invalid.',
      );
      expect(getUserController(req, res)).rejects.toStrictEqual(expected);
    });

    test('Valid but non-existing ID sent, should throw 404 HTTP exception for no user found.', () => {
      mockUser.findById.mockImplementation(() => null);
      const req = getMockReq({ params: { id: '123456123456123456123456' } });
      const expected = new HTTPException(
        'No user found',
        404,
        `No user matching the ID ${req.params.id}.`,
      );
      expect(getUserController(req, res)).rejects.toStrictEqual(expected);
    });

    test('Valid and existing ID passed, should return user details and 200 status', async () => {
      const testUser = {
        _id: '123456123456123456123456',
        name: 'Test',
        address: 'Testland',
        description: 'Test phrase.',
      };
      mockUser.findById.mockImplementation(() => testUser);
      const req = getMockReq({ params: { id: '123456123456123456123456' } });
      await getUserController(req, res, next);
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith(testUser);
    });
  });

  describe('/users - CREATE one user document', () => {
    test('No user data recieved, should throw 400 HTTP exception.', () => {
      const req = getMockReq({ body: {} });
      const expected = new HTTPException(
        'No user information recieved.',
        400,
        'Request invalid as no user information received to be posted.',
      );
      expect(createUserController(req, res)).rejects.toMatchObject(expected);
    });

    test('Valid user data recieved, should return 200 response with user data and id.', async () => {
      const userData = {
        name: 'Test',
        address: 'Testland',
        description: 'Test phrase.',
      };
      const req = getMockReq({ body: userData });
      mockUser.create.mockImplementation(data => ({
        _id: '123456123456123456123456',
        ...data,
      }));
      await createUserController(req, res);
      expect(res.status).toBeCalledWith(201);
      expect(res.json).toBeCalledWith({
        ...userData,
        _id: '123456123456123456123456',
      });
    });
  });

  describe('/users/:id - UPDATE one user document', () => {
    test('Not valid ID sent (length <24), should throw 400 HTTP exception for invalid ID.', () => {
      mockUser.findById.mockImplementation(() => null);
      const req = getMockReq({ params: { id: '12345612345612345612345' } });
      const expected = new HTTPException(
        'Request invalid',
        400,
        'User ID is invalid.',
      );
      expect(updateUserController(req, res)).rejects.toStrictEqual(expected);
    });

    test('Valid Id param but no user data recieved, should throw 400 HTTP exception.', () => {
      const req = getMockReq({
        body: {},
        params: { id: '123456123456123456123456' },
      });
      const expected = new HTTPException(
        'No user information recieved.',
        400,
        'Request invalid as no user information received to be posted.',
      );
      expect(updateUserController(req, res)).rejects.toMatchObject(expected);
    });

    test('Valid user data recieved, should return 200 response with updated user data.', async () => {
      const userData = {
        _id: '123456123456123456123456',
        id: '123456123456123456123456',
        name: 'Test',
        address: 'Testland',
        description: 'Test phrase.',
      };
      const req = getMockReq({
        body: userData,
        params: { id: '123456123456123456123456' },
      });
      mockUser.validate(() => {});
      mockUser.findByIdAndUpdate.mockImplementation((id, data) => data);
      await updateUserController(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith(userData);
    });
  });

  describe('/users/:id - DELETE one user document', () => {
    test('Not valid ID sent (length <24), should throw 400 HTTP exception for invalid ID.', () => {
      mockUser.findById.mockImplementation(() => null);
      const req = getMockReq({ params: { id: '12345612345612345612345' } });
      const expected = new HTTPException(
        'Request invalid',
        400,
        'User ID is invalid.',
      );
      expect(deleteUserController(req, res)).rejects.toMatchObject(expected);
    });

    test('Valid Id param but no user found, should throw 404 HTTP exception.', () => {
      const req = getMockReq({
        params: { id: '123456123456123456123456' },
      });
      mockUser.findByIdAndDelete.mockImplementation(() => null);
      const expected = new HTTPException(
        'User ID not found.',
        404,
        `The User Id: ${req.params.id} cannot be found.`,
      );
      expect(deleteUserController(req, res)).rejects.toMatchObject(expected);
    });

    test('Valid user found, should return 200 response with deleted user data.', async () => {
      const userData = {
        _id: '123456123456123456123456',
        id: '123456123456123456123456',
        name: 'Test',
        address: 'Testland',
        description: 'Test phrase.',
      };
      const req = getMockReq({
        params: { id: '123456123456123456123456' },
      });
      mockUser.findByIdAndDelete.mockImplementation(() => userData);
      await deleteUserController(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith(userData);
    });
  });
});
