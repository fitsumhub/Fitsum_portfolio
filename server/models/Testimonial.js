import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  position: { 
    type: String, 
    trim: true,
    maxlength: [100, 'Position cannot exceed 100 characters']
  },
  company: { 
    type: String, 
    trim: true,
    maxlength: [100, 'Company cannot exceed 100 characters']
  },
  content: { 
    type: String, 
    required: [true, 'Content is required'],
    trim: true,
    minlength: [10, 'Content must be at least 10 characters'],
    maxlength: [1000, 'Content cannot exceed 1000 characters']
  },
  avatar_url: { type: String },
  rating: { 
    type: Number, 
    default: 5, 
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: true },
  publishedAt: { type: Date },
  order_index: { type: Number, default: 0, min: 0 }
}, {
  timestamps: true
});

// Indexes for better query performance
testimonialSchema.index({ published: 1, order_index: 1 });
testimonialSchema.index({ featured: 1 });
testimonialSchema.index({ name: 'text', content: 'text' });

// Pre-save hook to set publishedAt
testimonialSchema.pre('save', function(next) {
  if (this.isNew && this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  if (this.isModified('published') && this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

export default mongoose.model('Testimonial', testimonialSchema);

