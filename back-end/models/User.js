/**
 * models/User.js
 *
 * Mongoose schema for a StudySpot user.
 * Replaces the mock data in data/mockUsers.js.
 */

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
