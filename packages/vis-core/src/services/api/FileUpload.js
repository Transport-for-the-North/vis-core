import BaseService from "./Base";
import Cookies from "js-cookie";

/**
 * FileUploadService extends BaseService to handle file uploads.
 * Supports multipart/form-data uploads with progress tracking.
 */
export class FileUploadService extends BaseService {
  /**
   * Constructs a new FileUploadService instance.
   * @constructor
   * @param {Object} options - Optional configuration options.
   */
  constructor(options = {}) {
    super({ pathPrefix: "", ...options });
  }

  /**
   * Uploads a file to the specified endpoint using multipart/form-data.
   *
   * @param {string} [subPath="/api/files/upload"] - The API endpoint path.
   * @param {File} file - The file to upload.
   * @param {Object} [options={}] - Additional options.
   * @property {Object} [options.metadata={}] - Additional metadata to send with the file.
   * @property {Function} [options.onProgress] - Progress callback (progress: 0-100).
   * @property {boolean} [options.skipAuth=false] - Flag to skip adding Authorization header.
   * @returns {Promise<Object>} The response data from the server.
   * @throws {Error} If the upload fails.
   */
  async uploadFile(
    subPath = "/api/files/upload",
    file,
    options = { metadata: {}, onProgress: null, skipAuth: false }
  ) {
    if (!file || !(file instanceof File)) {
      throw new Error("Invalid file provided. Expected a File object.");
    }

    const url = this._buildUrl(subPath);
    const jwtToken = options.skipAuth ? null : Cookies.get("token");

    // Create FormData
    const formData = new FormData();
    formData.append("file", file);

    // Add metadata if provided
    if (options.metadata && Object.keys(options.metadata).length > 0) {
      Object.entries(options.metadata).forEach(([key, value]) => {
        formData.append(key, typeof value === "object" ? JSON.stringify(value) : value);
      });
    }

    // Create fetch options
    const fetchOptions = {
      method: "POST",
      headers: {
        ...(jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}),
        // Don't set Content-Type - let browser set it with boundary for multipart/form-data
      },
      body: formData,
    };

    // Handle progress if XMLHttpRequest is available and callback provided
    if (options.onProgress && typeof XMLHttpRequest !== "undefined") {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            if (options.onProgress) {
              options.onProgress(percentComplete);
            }
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (e) {
              // If response is not JSON, return as text
              resolve({ message: xhr.responseText, status: xhr.status });
            }
          } else {
            try {
              const error = JSON.parse(xhr.responseText);
              reject(new Error(error.message || `HTTP error! status: ${xhr.status}`));
            } catch (e) {
              reject(new Error(`HTTP error! status: ${xhr.status}`));
            }
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Network error during file upload"));
        });

        xhr.addEventListener("abort", () => {
          reject(new Error("Upload aborted"));
        });

        xhr.open("POST", url);
        if (jwtToken) {
          xhr.setRequestHeader("Authorization", `Bearer ${jwtToken}`);
        }
        xhr.send(formData);
      });
    } else {
      // Use standard fetch (no progress tracking)
      const response = await fetch(url, fetchOptions).catch((error) => {
        console.error("Upload error:", error);
        throw new Error(`Network error: ${error.message}`);
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // Response is not JSON
        }
        throw new Error(errorMessage);
      }

      const data = await response.json().catch(() => {
        // If response is not JSON, return status
        return { message: "File uploaded successfully", status: response.status };
      });

      return data;
    }
  }

  /**
   * Gets the upload status for a specific upload ID.
   *
   * @param {string} uploadId - The upload ID to check status for.
   * @param {string} [subPath="/api/files/upload/{uploadId}/status"] - The API endpoint path.
   * @param {Object} [options={}] - Additional options.
   * @returns {Promise<Object>} The upload status data.
   */
  async getUploadStatus(uploadId, subPath = "/api/files/upload/{uploadId}/status", options = {}) {
    const path = subPath.replace("{uploadId}", uploadId);
    return this.get(path, options);
  }

  /**
   * Gets the upload history for the current user.
   *
   * @param {string} [subPath="/api/files/upload/history"] - The API endpoint path.
   * @param {Object} [options={}] - Additional options including query parameters.
   * @returns {Promise<Array>} Array of upload history items.
   */
  async getUploadHistory(subPath = "/api/files/upload/history", options = {}) {
    return this.get(subPath, options);
  }
}
