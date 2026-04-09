// Unit tests for filterSpotsBySearch (US3 #25 + #26)

import { expect } from 'chai';
import { filterSpotsBySearch } from '../routes/spots.js';
import { MOCK_SPOTS } from '../data/mockSpots.js';
import { buildNewSpot } from '../data/mockSpots.js';

describe('filterSpotsBySearch', () => {
  it('returns all spots when search is undefined', () => {
    expect(filterSpotsBySearch(MOCK_SPOTS, undefined)).to.deep.equal(MOCK_SPOTS);
  });

  it('returns all spots when search is an empty string', () => {
    expect(filterSpotsBySearch(MOCK_SPOTS, '')).to.deep.equal(MOCK_SPOTS);
  });

  it('returns all spots when search is only whitespace', () => {
    expect(filterSpotsBySearch(MOCK_SPOTS, '   ')).to.deep.equal(MOCK_SPOTS);
  });

  it('matches name with a lowercase partial query', () => {
    const result = filterSpotsBySearch(MOCK_SPOTS, 'bobst');
    expect(result).to.have.lengthOf(1);
    expect(result[0].id).to.equal('1');
  });

  it('matches name with a mixed-case query (case-insensitive)', () => {
    const result = filterSpotsBySearch(MOCK_SPOTS, 'KiMmEl');
    expect(result).to.have.lengthOf(1);
    expect(result[0].id).to.equal('2');
  });

  it('matches name with a partial query in the middle of the name', () => {
    const result = filterSpotsBySearch(MOCK_SPOTS, 'study');
    expect(result).to.have.lengthOf(1);
    expect(result[0].id).to.equal('4'); // Weinstein Study Room
  });

  it('returns [] when no spot name matches', () => {
    expect(filterSpotsBySearch(MOCK_SPOTS, 'nonexistent')).to.deep.equal([]);
  });

  it('matches name only — does NOT match by building name', () => {
    // 'Dibner' is the building of spot 3 ('Tandon MakerSpace') but is not in its name.
    expect(filterSpotsBySearch(MOCK_SPOTS, 'Dibner')).to.deep.equal([]);
  });
});


describe('buildNewSpot', () => {
  it('should return an object with all required spot fields', () => {
    const spot = buildNewSpot(
      { spotName: 'Test Spot', address: '123 Main St', hours: '9AM-5PM', description: 'A place' },
      'photo-123.jpg'
    );
    expect(spot).to.have.all.keys(
      'id', 'name', 'building', 'address', 'rating', 'reviewCount',
      'busyness', 'busynessLabel', 'noiseLevel', 'hasOutlets', 'hasWifi',
      'description', 'amenities', 'hours', 'imageUrl'
    );
  });
  it('should set name and building from spotName', () => {
    const spot = buildNewSpot(
      { spotName: 'Bobst 5th floor', address: '70 WSS', hours: '9AM-5PM', description: 'desc' },
      'img.jpg'
    );
    expect(spot.name).to.equal('Bobst 5th floor');
    expect(spot.building).to.equal('Bobst 5th floor');
  });
  it('should set imageUrl from filename', () => {
    const spot = buildNewSpot(
      { spotName: 'X', address: 'Y', hours: 'Z', description: 'D' },
      'photo-123.jpg'
    );
    expect(spot.imageUrl).to.equal('/static/uploads/photo-123.jpg');
  });
  it('should set imageUrl to empty string when no filename is provided', () => {
    const spot = buildNewSpot(
      { spotName: 'X', address: 'Y', hours: 'Z', description: 'D' },
      undefined
    );
    expect(spot.imageUrl).to.equal('');
  });
  it('should default rating and reviewCount to 0', () => {
    const spot = buildNewSpot(
      { spotName: 'X', address: 'Y', hours: 'Z', description: 'D' },
      'img.jpg'
    );
    expect(spot.rating).to.equal(0);
    expect(spot.reviewCount).to.equal(0);
  });
  it('should wrap hours string into the expected array format', () => {
    const spot = buildNewSpot(
      { spotName: 'X', address: 'Y', hours: '8AM-10PM', description: 'D' },
      'img.jpg'
    );
    expect(spot.hours).to.deep.equal([{ day: 'See listing', time: '8AM-10PM' }]);
  });
});