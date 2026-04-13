// Unit tests for filterSpotsBySearch (US3 #25 + #26)

import { expect } from 'chai';
import { filterSpots } from '../routes/spots.js';
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

  it('stores hours array directly when given an array', () => {
    const hoursArray = [
      { day: 'Monday', time: '8:00 AM - 10:00 PM' },
      { day: 'Tuesday', time: 'Closed' },
    ];
    const spot = buildNewSpot(
      { spotName: 'X', address: 'Y', hours: hoursArray, description: 'D' },
      'img.jpg'
    );
    expect(spot.hours).to.deep.equal(hoursArray);
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