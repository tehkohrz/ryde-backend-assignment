import HTTPException from '../controllers/HTTPException.js';
import calculatePagination from '../controllers/helpers.js';

describe('Helper Function', () => {
  describe('Calculate pagination', () => {
    test('No query selected of 5 total pages, no offset and default 10 limit returned', () => {
      const tested = calculatePagination(undefined, 50);
      const expected = { offSet: 0, pageLimit: 10 };
      expect(tested).toStrictEqual(expected);
    });

    test('Selected page 2 of 5 total pages, offset 10 documents and default 10 limit returned', () => {
      const query = { page: 2 };
      const tested = calculatePagination(query, 50);
      const expected = { offSet: 10, pageLimit: 10 };
      expect(tested).toStrictEqual(expected);
    });

    test('Selected page 3 of 5 total pages and limit 20, offset 20 documents and limit 20 returned', () => {
      const query = { page: 3, limit: 20 };
      const tested = calculatePagination(query, 50);
      const expected = { offSet: 40, pageLimit: 20 };
      expect(tested).toStrictEqual(expected);
    });

    test('Selected -1 page of 5 total pages, throw HTTPException error', () => {
      const query = { page: -1 };
      const tested = () => calculatePagination(query, 50);
      const expected = new HTTPException(
        'Invalid page number.',
        400,
        `Page number -1 does not exist`,
      );
      expect(tested).toThrow(expected);
    });

    test('Selected 6 page of 5 total pages, throw HTTPException error', () => {
      const query = { page: 6 };
      const tested = () => calculatePagination(query, 50);
      const expected = new HTTPException(
        'Invalid page number.',
        400,
        `Page number 6 does not exist`,
      );
      expect(tested).toThrow(expected);
    });

    test('Invalid query page "a", throw HTTPException error', () => {
      const query = { page: 'a' };
      const tested = () => calculatePagination(query, 50);
      const expected = new HTTPException(
        'Invalid query.',
        400,
        `Query parameters are not of the correct type`,
      );
      expect(tested).toThrow(expected);
    });
  });
});
