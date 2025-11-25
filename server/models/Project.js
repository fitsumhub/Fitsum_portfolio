import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: { 
    type: String, 
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  longDescription: { type: String, trim: true },
  image_url: { type: String },
  technologies: [{ 
    type: String,
    trim: true
  }],
  github_url: { 
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'GitHub URL must be a valid URL'
    }
  },
  live_url: { 
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Live URL must be a valid URL'
    }
  },
  category: { 
    type: String, 
    default: 'Web Development',
    enum: ['Web Development', 'Mobile Development', 'Desktop Development', 'Other']
  },
  featured: { type: Boolean, default: false },
  status: { 
    type: String, 
    default: 'Live',
    enum: ['Live', 'Prototype', 'Completed', 'In Progress', 'Draft']
  },
  published: { type: Boolean, default: true },
  publishedAt: { type: Date },
  scheduledPublish: { type: Date },
  order_index: { type: Number, default: 0, min: 0 },
  impact: { type: String, trim: true },
  achievements: [{ type: String, trim: true }]
}, {
  timestamps: true
});

// Index for better query performance
projectSchema.index({ published: 1, order_index: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ featured: 1 });
projectSchema.index({ title: 'text', description: 'text' });

// Pre-save hook to set publishedAt
projectSchema.pre('save', function(next) {
  if (this.isNew && this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  if (this.isModified('published') && this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

export default mongoose.model('Project', projectSchema);

