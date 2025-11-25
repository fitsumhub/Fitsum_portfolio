import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: { 
    type: String, 
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters']
  },
  email: { 
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return !v || /^\S+@\S+\.\S+$/.test(v);
      },
      message: 'Invalid email address'
    }
  },
  phone: { 
    type: String,
    trim: true
  },
  location: { 
    type: String,
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  website: { type: String, trim: true },
  github_url: { 
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'GitHub URL must be a valid URL'
    }
  },
  linkedin_url: { 
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'LinkedIn URL must be a valid URL'
    }
  },
  youtube_ethiopia_url: { 
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'YouTube URL must be a valid URL'
    }
  },
  youtube_hustler_url: { 
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'YouTube URL must be a valid URL'
    }
  },
  telegram_username: { 
    type: String,
    trim: true,
    maxlength: [100, 'Telegram username cannot exceed 100 characters']
  },
  telegram_channel_url: { 
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Telegram channel URL must be a valid URL'
    }
  },
  profile_image: { type: String },
  resume_url: { type: String }
}, {
  timestamps: true
});

// Ensure only one profile document exists
profileSchema.statics.getProfile = async function() {
  let profile = await this.findOne();
  if (!profile) {
      profile = await this.create({
        name: 'Fitsum Enunu',
        title: 'Web Developer & Tech Creator | Business • Tech • Hustle',
        description: 'Passionate about building innovative solutions and creating engaging content. Creator of educational content with 100K+ YouTube subscribers and 24.4K Telegram followers. DM for promotions.',
        email: 'fitsumenunu21@gmail.com',
        phone: '0920209609',
        location: 'Ethiopia',
        github_url: 'https://github.com/fitsumhub',
        linkedin_url: 'https://linkedin.com/in/fitsum-enunu',
        youtube_ethiopia_url: 'https://www.youtube.com/@AplusEthiopia',
        youtube_hustler_url: 'https://www.youtube.com/@AplusHustler',
        telegram_username: 'fitsum00000',
        telegram_channel_url: 'https://t.me/AplusHustler',
        profile_image: '/images/profile.jpg'
      });
  }
  return profile;
};

export default mongoose.model('Profile', profileSchema);

