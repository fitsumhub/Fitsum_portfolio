/**
 * Helper utility functions
 */

/**
 * Paginate query results
 */
export const paginate = async (Model, query = {}, options = {}) => {
  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 10;
  const skip = (page - 1) * limit;
  
  const sort = options.sort || 'createdAt';
  const order = options.order === 'asc' ? 1 : -1;
  const sortObj = { [sort]: order };
  
  // Build search query if provided
  if (options.search) {
    const searchRegex = new RegExp(options.search, 'i');
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { name: searchRegex },
      { content: searchRegex }
    ];
  }
  
  // Filter by status if provided
  if (options.status) {
    query.status = options.status;
  }
  
  // Filter by published if provided
  if (options.published !== undefined) {
    query.published = options.published === 'true';
  }
  
  const [data, total] = await Promise.all([
    Model.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean(),
    Model.countDocuments(query)
  ]);
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    }
  };
};

/**
 * Delete file from filesystem
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const deleteFile = async (filePath) => {
  try {
    if (filePath && filePath.startsWith('/uploads/')) {
      const fullPath = path.join(__dirname, '..', filePath);
      await fs.unlink(fullPath);
      return true;
    }
    return false;
  } catch (error) {
    // File might not exist, which is okay
    if (error.code !== 'ENOENT') {
      console.error('Error deleting file:', error);
    }
    return false;
  }
};

/**
 * Validate MongoDB ObjectId
 */
export const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Sanitize filename
 */
export const sanitizeFilename = (filename) => {
  return filename
    .replace(/[^a-z0-9.-]/gi, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
};

/**
 * Format API response
 */
export const formatResponse = (data, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    message,
    data
  };
  if (statusCode !== 200) {
    response.statusCode = statusCode;
  }
  return response;
};

