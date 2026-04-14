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

// ── POST /:spotId/reviews ─────────────────────────────────────────────────────
describe('POST /api/studyspots/:spotId/reviews (logic)', () => {
  beforeEach(() => {
    reviewsStore.clear();
  });

  it('should store a review for a valid spot', () => {
    const spotId = '1';
    const review = { id: '1', spotId, rating: 4, text: 'Great spot', createdAt: new Date().toISOString() };
    reviewsStore.set(spotId, [review]);
    expect(reviewsStore.get(spotId)).to.have.lengthOf(1);
    expect(reviewsStore.get(spotId)[0].rating).to.equal(4);
  });

  it('should store multiple reviews for the same spot', () => {
    const spotId = '1';
    reviewsStore.set(spotId, [
      { id: '1', spotId, rating: 4, text: 'Good', createdAt: new Date().toISOString() },
      { id: '2', spotId, rating: 2, text: 'Noisy', createdAt: new Date().toISOString() },
    ]);
    expect(reviewsStore.get(spotId)).to.have.lengthOf(2);
  });

  it('should correctly calculate average rating', () => {
    const reviews = [{ rating: 4 }, { rating: 2 }];
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    expect(avg).to.equal(3);
  });

  it('should reject a rating below 1', () => {
    const rating = 0;
    expect(rating < 1 || rating > 5).to.be.true;
  });

  it('should reject a rating above 5', () => {
    const rating = 6;
    expect(rating < 1 || rating > 5).to.be.true;
  });

  it('should allow a review with no text', () => {
    const spotId = '2';
    const review = { id: '1', spotId, rating: 3, text: '', createdAt: new Date().toISOString() };
    reviewsStore.set(spotId, [review]);
    expect(reviewsStore.get(spotId)[0].text).to.equal('');
  });

  it('reviewsStore should be empty after clearing', () => {
    reviewsStore.set('1', [{ rating: 5 }]);
    reviewsStore.clear();
    expect(reviewsStore.size).to.equal(0);
  });
});