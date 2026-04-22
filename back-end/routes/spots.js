// Routes for study spot search, filtering, detail retrieval,
// busyness updates, and reviews.
import express from 'express';
import { body, query, validationResult } from 'express-validator';
import Spot from '../models/Spot.js';
import Review from '../models/Review.js';
import { MOCK_SPOTS } from '../data/mockSpots.js';

const router = express.Router();

const NOISE_LEVELS = ['Quiet', 'Moderate', 'Loud'];
const BUSYNESS_LABELS = ['Quiet', 'Moderate', 'Busy'];

const listQueryValidators = [
  query('search').optional().isString().trim().isLength({ max: 100 }),
  query('quiet').optional().isBoolean(),
  query('outlets').optional().isBoolean(),
  query('groupFriendly').optional().isBoolean(),
  query('wifi').optional().isBoolean(),
  query('noiseLevel').optional().isIn(NOISE_LEVELS),
  query('busyness').optional().isIn(BUSYNESS_LABELS),
];

// In-memory reviews store kept for unit tests only
// The actual POST /reviews route now uses MongoDB
const reviewsStore = new Map();

function matchesQuietFilter(spot) {
  return (
    spot.noiseLevel?.toLowerCase() === 'quiet' ||
    spot.amenities?.includes('Quiet Zone')
  );
}

function matchesGroupFriendlyFilter(spot) {
  return (
    spot.groupFriendly === true ||
    spot.amenities?.includes('Group Tables')
  );
}

function parseBusynessValue(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
}

export function filterSpots(spots, query = {}) {
  let results = [...spots];

  const search = (query.search || '').trim().toLowerCase();
  if (search) {
    results = results.filter(spot => spot.name.toLowerCase().includes(search));
  }

  if (query.quiet === 'true') {
    results = results.filter(matchesQuietFilter);
  }

  if (query.outlets === 'true') {
    results = results.filter(spot => spot.hasOutlets === true);
  }

  if (query.groupFriendly === 'true') {
    results = results.filter(matchesGroupFriendlyFilter);
  }

  return results;
}

// GET /api/studyspots
router.get('/', listQueryValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const mongoQuery = {};

    if (req.query.search) {
      mongoQuery.name = { $regex: req.query.search.trim(), $options: 'i' };
    }

    if (req.query.outlets !== undefined) {
      mongoQuery.hasOutlets = req.query.outlets === 'true';
    }

    if (req.query.groupFriendly === 'true') {
      mongoQuery.groupFriendly = true;
    }

    if (req.query.wifi !== undefined) {
      mongoQuery.hasWifi = req.query.wifi === 'true';
    }

    if (req.query.noiseLevel) {
      mongoQuery.noiseLevel = { $regex: `^${req.query.noiseLevel}$`, $options: 'i' };
    }

    if (req.query.busyness) {
      mongoQuery.busynessLabel = { $regex: `^${req.query.busyness}$`, $options: 'i' };
    }

    if (req.query.quiet === 'true') {
      mongoQuery.$or = [
        { noiseLevel: { $regex: '^quiet$', $options: 'i' } },
        { amenities: 'Quiet Zone' },
      ];
    }

    const spots = await Spot.find(mongoQuery);
    res.json(spots);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch study spots.' });
  }
});

// GET /api/studyspots/:spotId
router.get('/:spotId', async (req, res) => {
  try {
    const spot = await Spot.findById(req.params.spotId);

    if (!spot) {
      return res.status(404).json({ error: 'Spot not found.' });
    }

    res.json(spot);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch study spot.' });
  }
});

// PATCH /api/studyspots/:spotId/busyness — update overall spot busyness
router.patch('/:spotId/busyness', async (req, res) => {
  try {
    const { spotId } = req.params;
    const { busyness, busynessLabel } = req.body;
    const parsedBusyness = parseBusynessValue(busyness);

    const spot = await Spot.findById(spotId);
    if (!spot) {
      return res.status(404).json({ error: 'Spot not found.' });
    }

    if (parsedBusyness === null && !busynessLabel) {
      return res.status(400).json({
        error: 'Provide a valid busyness value or busynessLabel.',
      });
    }

    if (parsedBusyness !== null) {
      spot.busyness = parsedBusyness;
    }

    if (busynessLabel) {
      spot.busynessLabel = busynessLabel;
    }

    await spot.save();

    res.json({
      message: 'Busyness updated.',
      spot: {
        id: spot.id,
        busyness: spot.busyness,
        busynessLabel: spot.busynessLabel,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update busyness.' });
  }
});

// POST /api/studyspots/:spotId/reviews — submit a rating and optional review
// Validation rules
const reviewValidation = [
  body('rating')
    .notEmpty().withMessage('Rating is required.')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be a whole number between 1 and 5.'),
  body('text')
    .optional()
    .isString().withMessage('Review text must be a string.')
    .isLength({ max: 500 }).withMessage('Review text must be 500 characters or fewer.')
    .trim(),
];

router.post('/:spotId/reviews', reviewValidation, async (req, res) => {
  // Return validation errors if any
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { spotId } = req.params;
    const { rating, text } = req.body;

    const spot = await Spot.findById(spotId);
    if (!spot) {
      return res.status(404).json({ error: 'Spot not found.' });
    }

    // Save review to database
    const review = await Review.create({
      spotId: spot._id,
      userId: req.userId || null,
      rating: Number(rating),
      text: text || '',
    });

    // Recalculate spot rating average from all reviews in DB
    const allReviews = await Review.find({ spotId: spot._id });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    spot.rating = Math.round(avg * 10) / 10;
    spot.reviewCount = allReviews.length;
    await spot.save();

    res.status(201).json({ message: 'Review submitted.', review });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit review.' });
  }
});

// PATCH /api/studyspots/:spotId/micro-locations/:microLocationId/busyness
router.patch('/:spotId/micro-locations/:microLocationId/busyness', async (req, res) => {
  try {
    const { spotId, microLocationId } = req.params;
    const { busyness, busynessLabel } = req.body;
    const parsedBusyness = parseBusynessValue(busyness);

    const spot = await Spot.findById(spotId);
    if (!spot) {
      return res.status(404).json({ error: 'Spot not found.' });
    }

    if (!spot.microLocations || spot.microLocations.length === 0) {
      return res.status(404).json({ error: 'No micro-locations found for this spot.' });
    }

    const microLocation = spot.microLocations.id(microLocationId);
    if (!microLocation) {
      return res.status(404).json({ error: 'Micro-location not found.' });
    }

    if (parsedBusyness === null && !busynessLabel) {
      return res.status(400).json({
        error: 'Provide a valid busyness value or busyness label.',
      });
    }

    if (parsedBusyness !== null) {
      microLocation.busyness = parsedBusyness;
    }

    if (busynessLabel) {
      microLocation.busynessLabel = busynessLabel;
    }

    await spot.save();

    res.json({
      message: 'Micro-location busyness updated.',
      microLocation,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update micro-location busyness.' });
  }
});

export { reviewsStore };
export default router;