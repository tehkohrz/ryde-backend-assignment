import { HTTPException } from './errorHandler.js';

// Pagination function to calculate record offset and retrieve limit
// Checks of invalid page numbers
export default function calculatePagination(query, totalCount) {
  // Query params for current page and document limit
  // Default page of 1 and limit of 10
  const currentPage = query?.page ? Number(query.page) : 1;
  const pageLimit = query?.limit ? Number(query.limit) : 10;
  // Check that the query is of the correct type
  if (isNaN(currentPage) || isNaN(pageLimit)) {
    throw new HTTPException(
      'Invalid query.',
      400,
      `Query parameters are not of the correct type`,
    );
  }
  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageLimit);
  // Checking for negative page numbers
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
