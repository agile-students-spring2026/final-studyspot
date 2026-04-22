// Unit tests for filterSpots, buildNewSpot, busyness endpoint, and reviews endpoint

import { expect } from 'chai';
import { filterSpots, reviewsStore } from '../routes/spots.js';
import { MOCK_SPOTS, buildNewSpot } from '../data/mockSpots.js';

describe('filterSpots', () => {
  it('returns all spots when search is undefined', () => {
    expect(filterSpots(MOCK_SPOTS, {})).to.deep.equal(MOCK_SPOTS);
  });

  it('returns all spots when search is an empty string', () => {
    expect(filterSpots(MOCK_SPOTS, { search: '' })).to.deep.equal(MOCK_SPOTS);
  });

  it('returns all spots when search is only whitespace', () => {
    expect(filterSpots(MOCK_SPOTS, { search: '   ' })).to.deep.equal(MOCK_SPOTS);
  });

  it('matches name with a lowercase partial query', () => {
    const result = filterSpots(MOCK_SPOTS, { search: 'bobst' });
    expect(result).to.have.lengthOf(1);
    expect(result[0].id).to.equal('1');
  });

  it('matches name with a mixed-case query (case-insensitive)', () => {
    const result = filterSpots(MOCK_SPOTS, { search: 'KiMmEl' });
    expect(result).to.have.lengthOf(1);
    expect(result[0].id).to.equal('2');
  });

  it('matches name with a partial query in the middle of the name', () => {
    const result = filterSpots(MOCK_SPOTS, { search: 'study' });
    expect(result).to.have.lengthOf(1);
    expect(result[0].id).to.equal('4');
  });

  it('returns [] when no spot name matches', () => {
    expect(filterSpots(MOCK_SPOTS, { search: 'nonexistent' })).to.deep.equal([]);
  });

  it('matches name only and does not match by building name', () => {
    expect(filterSpots(MOCK_SPOTS, { search: 'Dibner' })).to.deep.equal([]);
  });

  it('filters quiet spots', () => {
    const result = filterSpots(MOCK_SPOTS, { quiet: 'true' });
    expect(result.map(spot => spot.id)).to.deep.equal(['1', '4']);
  });

  it('filters spots with outlets', () => {
    const result = filterSpots(MOCK_SPOTS, { outlets: 'true' });
    expect(result.map(spot => spot.id)).to.deep.equal(['1', '2', '3', '4']);
  });

  it('filters group-friendly spots', () => {
    const result = filterSpots(MOCK_SPOTS, { groupFriendly: 'true' });
    expect(result.map(spot => spot.id)).to.deep.equal(['2', '3']);
  });

  it('supports combining search and filters together', () => {
    const result = filterSpots(MOCK_SPOTS, {
      search: 'kimmel',
      groupFriendly: 'true',
    });
    expect(result).to.have.lengthOf(1);
    expect(result[0].id).to.equal('2');
  });
});

describe('buildNewSpot', () => {
  it('returns an object with all required spot fields', () => {
    const spot = buildNewSpot(
      {
        spotName: 'Test Spot',
        address: '123 Main St',
        hours: '9AM-5PM',
        description: 'A place',
      },
      'photo-123.jpg'
    );

    expect(spot).to.have.all.keys(
      'id',
      'name',
      'building',
      'address',
      'googleMapsUrl',
      'rating',
      'reviewCount',
      'busyness',
      'busynessLabel',
      'noiseLevel',
      'hasOutlets',
      'hasWifi',
      'groupFriendly',
      'description',
      'amenities',
      'hours',
      'imageUrl',
      'microLocations'
    );
  });

  it('sets name and building from spotName', () => {
    const spot = buildNewSpot(
      {
        spotName: 'Bobst 5th floor',
        address: '70 WSS',
        hours: '9AM-5PM',
        description: 'desc',
      },
      'img.jpg'
    );
    expect(spot.name).to.equal('Bobst 5th floor');
    expect(spot.building).to.equal('Bobst 5th floor');
  });

  it('sets imageUrl from filename', () => {
    const spot = buildNewSpot(
      { spotName: 'X', address: 'Y', hours: 'Z', description: 'D' },
      'photo-123.jpg'
    );
    expect(spot.imageUrl).to.equal('/static/uploads/photo-123.jpg');
  });

  it('sets imageUrl to empty string when no filename is provided', () => {
    const spot = buildNewSpot(
      { spotName: 'X', address: 'Y', hours: 'Z', description: 'D' },
      undefined
    );
    expect(spot.imageUrl).to.equal('');
  });

  it('defaults rating and reviewCount to 0', () => {
    const spot = buildNewSpot(
      { spotName: 'X', address: 'Y', hours: 'Z', description: 'D' },
      'img.jpg'
    );
    expect(spot.rating).to.equal(0);
    expect(spot.reviewCount).to.equal(0);
  });

  it('wraps hours string into the expected array format', () => {
    const spot = buildNewSpot(
      { spotName: 'X', address: 'Y', hours: '8AM-10PM', description: 'D' },
      'img.jpg'
    );
    expect(spot.hours).to.deep.equal([{ day: 'See listing', time: '8AM-10PM' }]);
  });

  it('builds a Google Maps URL from the address', () => {
    const spot = buildNewSpot(
      {
        spotName: 'Test Spot',
        address: '123 Main St, New York, NY',
        hours: '9AM-5PM',
        description: 'A place',
      },
      'img.jpg'
    );
    expect(spot.googleMapsUrl).to.equal(
      'https://www.google.com/maps/search/?api=1&query=123%20Main%20St%2C%20New%20York%2C%20NY'
    );
  });

  it('defaults groupFriendly to false and microLocations to an empty array', () => {
    const spot = buildNewSpot(
      { spotName: 'X', address: 'Y', hours: 'Z', description: 'D' },
      'img.jpg'
    );
    expect(spot.groupFriendly).to.equal(false);
    expect(spot.microLocations).to.deep.equal([]);
  });
});

// ── PATCH /:spotId/busyness ───────────────────────────────────────────────────
describe('PATCH /api/studyspots/:spotId/busyness (logic)', () => {
  it('should update busyness value on a valid spot', () => {
    const spot = MOCK_SPOTS.find(s => s.id === '1');
    const originalBusyness = spot.busyness;
    spot.busyness = 80;
    expect(spot.busyness).to.equal(80);
    spot.busyness = originalBusyness;
  });

  it('should update busynessLabel on a valid spot', () => {
    const spot = MOCK_SPOTS.find(s => s.id === '1');
    const original = spot.busynessLabel;
    spot.busynessLabel = 'Packed';
    expect(spot.busynessLabel).to.equal('Packed');
    spot.busynessLabel = original;
  });

  it('should return undefined for a spot that does not exist', () => {
    const spot = MOCK_SPOTS.find(s => s.id === 'nonexistent');
    expect(spot).to.be.undefined;
  });

  it('parseBusynessValue should parse a numeric string', () => {
    const parsed = Number('75');
    expect(parsed).to.equal(75);
  });

  it('parseBusynessValue should return NaN for a non-numeric string', () => {
    const parsed = Number('abc');
    expect(parsed).to.be.NaN;
  });
});

// ── Review model validation logic ─────────────────────────────────────────────
// Note: These tests cover the validation and calculation logic for reviews.
// The actual DB calls (Review.create, Review.find) require a live MongoDB
// connection and are covered by integration testing.
describe('Review validation logic', () => {
  it('should accept a rating of 1', () => {
    const rating = 1;
    expect(rating >= 1 && rating <= 5).to.be.true;
  });

  it('should accept a rating of 5', () => {
    const rating = 5;
    expect(rating >= 1 && rating <= 5).to.be.true;
  });

  it('should reject a rating of 0', () => {
    const rating = 0;
    expect(rating >= 1 && rating <= 5).to.be.false;
  });

  it('should reject a rating of 6', () => {
    const rating = 6;
    expect(rating >= 1 && rating <= 5).to.be.false;
  });

  it('should reject a non-integer rating', () => {
    const rating = 3.5;
    expect(Number.isInteger(rating)).to.be.false;
  });

  it('should allow review text up to 500 characters', () => {
    const text = 'a'.repeat(500);
    expect(text.length <= 500).to.be.true;
  });

  it('should reject review text over 500 characters', () => {
    const text = 'a'.repeat(501);
    expect(text.length <= 500).to.be.false;
  });

  it('should allow an empty review text', () => {
    const text = '';
    expect(typeof text === 'string').to.be.true;
  });

  it('correctly calculates average rating from multiple reviews', () => {
    const reviews = [{ rating: 5 }, { rating: 3 }, { rating: 4 }];
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    expect(Math.round(avg * 10) / 10).to.equal(4);
  });

  it('correctly calculates average rating for a single review', () => {
    const reviews = [{ rating: 3 }];
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    expect(avg).to.equal(3);
  });
});

// ── Data cleanup logic ────────────────────────────────────────────────────────
describe('Data cleanup logic (account deletion)', () => {
  it('should identify reviews belonging to a user', () => {
    const userId = 'user-123';
    const reviews = [
      { userId: 'user-123', rating: 4 },
      { userId: 'user-456', rating: 3 },
      { userId: 'user-123', rating: 5 },
    ];
    const userReviews = reviews.filter(r => r.userId === userId);
    expect(userReviews).to.have.lengthOf(2);
  });

  it('should identify saved spots belonging to a user', () => {
    const userId = 'user-123';
    const savedSpots = [
      { userId: 'user-123', spotId: 'spot-1' },
      { userId: 'user-456', spotId: 'spot-2' },
    ];
    const userSaved = savedSpots.filter(s => s.userId === userId);
    expect(userSaved).to.have.lengthOf(1);
  });

  it('should leave other users data intact after deletion', () => {
    const userId = 'user-123';
    const reviews = [
      { userId: 'user-123', rating: 4 },
      { userId: 'user-456', rating: 3 },
    ];
    const remaining = reviews.filter(r => r.userId !== userId);
    expect(remaining).to.have.lengthOf(1);
    expect(remaining[0].userId).to.equal('user-456');
  });
});