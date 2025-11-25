import mongoose from 'mongoose';

const youtubeSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: { 
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  url: { type: String },
  video_id: { type: String },
  videoId: { type: String },
  thumbnail_url: { type: String },
  thumbnail: { type: String },
  channel: { 
    type: String, 
    required: [true, 'Channel is required'],
    trim: true,
    maxlength: [100, 'Channel cannot exceed 100 characters'],
    default: 'AplusEthiopia'
  },
  views: { type: Number, default: 0, min: 0 },
  likes: { type: Number, default: 0, min: 0 },
  published_at: { type: Date },
  publishedAt: { type: Date },
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: true },
  order_index: { type: Number, default: 0, min: 0 }
}, {
  timestamps: true
});

// Indexes for better query performance
youtubeSchema.index({ published: 1, published_at: -1 });
youtubeSchema.index({ channel: 1 });
youtubeSchema.index({ featured: 1 });
youtubeSchema.index({ title: 'text', description: 'text' });

// Pre-save hook to set publishedAt
youtubeSchema.pre('save', function(next) {
  if (this.isNew && this.published && !this.publishedAt) {
    this.publishedAt = this.published_at || new Date();
  }
  if (this.isModified('published') && this.published && !this.publishedAt) {
    this.publishedAt = this.published_at || new Date();
  }
  next();
});

export default mongoose.model('YouTube', youtubeSchema);

