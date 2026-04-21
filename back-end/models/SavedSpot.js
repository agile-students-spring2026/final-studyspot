/**
 * models/SavedSpot.js
 *
 * Mongoose schema for a user's saved study spot.
 * Replaces the in-memory savedSpotsStore Map in routes/saved.js.
 *
 * Each document represents one spot saved by one user.
 * spotId is a string reference to the spot's id (from the spots collection).
 */

import mongoose from 'mongoose';

const savedSpotSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    spotId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('SavedSpot', savedSpotSchema);
