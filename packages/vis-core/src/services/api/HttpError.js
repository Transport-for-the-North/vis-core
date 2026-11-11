/**
 * Represents an HTTP error returned by an API request.
 */
export class HttpError extends Error {
  /**
   * Creates an instance of HttpError.
   * @param {number} status - HTTP status code
   * @param {string} message - Error message
   * @param {string} url - Request URL
   * @param {any} [body=null] - Optional response body
   */
  constructor(status, message, url, body = null) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.url = url;
    this.body = body;
  }
}