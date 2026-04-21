export class GetUsersQuery {
  /**
   * Page number (starts from 1).
   * Minimum value is 1. Default value is 1.
   */
  page?: number

  /**
   * Entries per page.
   * Minimum value is 1. Default value is 20.
   */
  page_size?: number

  /**
   * Search query parameters.
   * Supports flexible filtering by user fields with multiple modes.
   * Example: { 'search.id': 'user123', 'mode.id': 'exact' }
   */
  search_params?: Record<string, string>
}
