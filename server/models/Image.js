import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  filename: { 
    type: String, 
    required: [true, 'Filename is required'],
    trim: true
  },
  originalname: { 
    type: String, 
    required: [true, 'Original filename is required'],
    trim: true
  },
  path: { 
    type: String, 
    required: [true, 'File path is required'],
    trim: true
  },
  url: { 
    type: String, 
    required: [true, 'Image URL is required'],
    trim: true
  },
  category: { 
    type: String, 
    default: 'general',
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters']
  },
  alt_text: { 
    type: String, 
    default: '',
    trim: true,
    maxlength: [200, 'Alt text cannot exceed 200 characters']
  },
  size: { 
    type: Number,
    min: [0, 'File size cannot be negative']
  },
  mimetype: { 
    type: String,
    enum: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
imageSchema.index({ category: 1 });
imageSchema.index({ createdAt: -1 });

export default mongoose.model('Image', imageSchema);

