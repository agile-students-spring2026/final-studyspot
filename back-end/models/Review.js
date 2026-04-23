/**
 * models/Review.js
 *
 * Mongoose schema for a study spot review.
 *
 * Each document represents one user's rating and optional text review
 * for a specific study spot.
 */

import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    spotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Spot',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null for anonymous reviews (no auth required to rate)
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    text: {
      type: String,
      default: '',
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Review', reviewSchema);