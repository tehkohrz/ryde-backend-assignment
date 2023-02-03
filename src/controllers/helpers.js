import { HTTPException } from './errorHandler.js';

// Pagination function to calculate record offset and retrieve limit
// Checks of invalid page numbers
export default function calculatePagination(query, totalCount) {
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
