import mongoose from 'mongoose';

const hourSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const microLocationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    busyness: {
      type: Number,
      default: 0,
    },
    busynessLabel: {
      type: String,
      default: 'Empty',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

const spotSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    building: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    googleMapsUrl: {
      type: String,
      default: '',
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    busyness: {
      type: Number,
      default: 0,
    },
    busynessLabel: {
      type: String,
      default: 'Empty',
      trim: true,
    },
    noiseLevel: {
      type: String,
      default: 'Unknown',
      trim: true,
    },
    hasOutlets: {
      type: Boolean,
      default: false,
    },
    hasWifi: {
      type: Boolean,
      default: false,
    },
    groupFriendly: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    amenities: {
      type: [String],
      default: [],
    },
    hours: {
      type: [hourSchema],
      default: [],
    },
    imageUrl: {
      type: String,
      default: '',
      trim: true,
    },
    microLocations: {
      type: [microLocationSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Spot', spotSchema);