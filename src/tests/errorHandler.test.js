import { getMockReq, getMockRes } from '@jest-mock/express';
import mongoose from 'mongoose';
import routeErrorHandler from '../controllers/errorHandler.js';
import HTTPException from '../controllers/HTTPException.js';

describe('Error Handler', () => {
  const { res, next, clearMockRes } = getMockRes();
  const { req } = getMockReq();
  beforeEach(() => {
    clearMockRes();
  });
  describe('Handling of HTTPException', () => {
    test('Route controller throws an instance of HTTPException, should respond with status and msg', async () => {
      const mockFunction = async (reqArg, resArg, nextArg) => {
        throw new HTTPException('test name', 400, 'test msg');
      };
      await routeErrorHandler(mockFunction)(req, res, next);
      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalledWith(
        new HTTPException('test name', 400, 'test msg'),
      );
    });
  });

  describe('Handling of Mongoose Errors', () => {
    test('Route controller throws Mongoose validation error , should respond with status 400', async () => {
      const mockFunction = async (reqArg, resArg, nextArg) => {
        throw new mongoose.Error.ValidationError();
      };
      await routeErrorHandler(mockFunction)(req, res, next);
      expect(res.status).toBeCalledWith(400);
    });
  });

  describe('Handling of Unexpected Errors', () => {
    test('Route controller throws unknown error instance , should respond with status 500', async () => {
      const mockFunction = async (reqArg, resArg, nextArg) => {
        throw new Error();
      };
      await routeErrorHandler(mockFunction)(req, res, next);
      expect(res.status).toBeCalledWith(500);
      expect(res.json).toBeCalledWith({ message: 'Something went wrong!' });
    });
  });
});
