// Unit tests for filterSpotsBySearch (US3 #25 + #26)

import { expect } from 'chai';
import { filterSpotsBySearch } from '../routes/spots.js';
import { MOCK_SPOTS } from '../data/mockSpots.js';

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
