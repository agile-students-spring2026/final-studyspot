/**
 * data/mockSpots.js
 *
 * Mock study spot data served by the back-end API.
 *
 * This file will be replaced by real database queries during the database sprint.
 * Teammates: import MOCK_SPOTS into your spots route (GET /api/studyspots).
 *
 * Data matches the frontend's src/data/mockSpots.js exactly so that
 * frontend-backend integration requires no data structure changes.
 */

export const MOCK_SPOTS = [
  {
    id: '1',
    name: 'Bobst Library — 3rd Floor',
    building: 'Bobst Library',
    address: '70 Washington Square S',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=70+Washington+Square+S+New+York+NY',
    rating: 4.3,
    reviewCount: 84,
    busyness: 65,
    busynessLabel: 'Moderate',
    noiseLevel: 'Quiet',
    hasOutlets: true,
    hasWifi: true,
    groupFriendly: false,
    description:
      'Bright, open floor with plenty of table seating and individual carrels. ' +
      'Great natural light from the atrium. Gets busy around midterms but the ' +
      'upper mezzanine usually has open spots.',
    amenities: ['Outlets', 'Strong WiFi', 'Quiet Zone', 'Accessible'],
    hours: [
      { day: 'Mon – Thu', time: '8:00 AM – 2:00 AM' },
      { day: 'Friday',    time: '8:00 AM – 10:00 PM' },
      { day: 'Saturday',  time: '10:00 AM – 10:00 PM' },
      { day: 'Sunday',    time: '10:00 AM – 2:00 AM' },
    ],
    imageUrl: 'https://picsum.photos/seed/spot1/600/300',
    microLocations: [
      {
        id: '1a',
        name: 'Atrium Tables',
        tags: ['Open seating', 'Natural light', 'Outlets'],
        busyness: 75,
        busynessLabel: 'Busy',
        description: 'Large shared tables near the atrium. Good light, fills up quickly.',
      },
      {
        id: '1b',
        name: 'Upper Mezzanine',
        tags: ['Quiet', 'Deep focus', 'Individual seating'],
        busyness: 45,
        busynessLabel: 'Quiet',
        description: 'Usually calmer than the main floor and good for solo work.',
      },
      {
        id: '1c',
        name: 'Window Carrels',
        tags: ['Quiet', 'Outlets', 'Solo study'],
        busyness: 60,
        busynessLabel: 'Moderate',
        description: 'Best for long solo sessions with outlet access nearby.',
      },
    ],
  },
  {
    id: '2',
    name: 'Kimmel Center — 4th Floor Lounge',
    building: 'Kimmel Center',
    address: '60 Washington Square S',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=60+Washington+Square+S+New+York+NY',
    rating: 3.8,
    reviewCount: 42,
    busyness: 40,
    busynessLabel: 'Quiet',
    noiseLevel: 'Moderate',
    hasOutlets: true,
    hasWifi: true,
    groupFriendly: true,
    description:
      'Comfortable lounge seating with a quieter vibe. Good for group work or solo reading between classes.',
    amenities: ['Outlets', 'WiFi', 'Group Tables'],
    hours: [
      { day: 'Mon – Fri', time: '7:00 AM – 11:00 PM' },
      { day: 'Sat – Sun', time: '9:00 AM – 9:00 PM' },
    ],
    imageUrl: 'https://picsum.photos/seed/spot2/600/300',
    microLocations: [
      {
        id: '2a',
        name: 'Window Lounge Chairs',
        tags: ['Casual seating', 'Moderate noise', 'Solo study'],
        busyness: 35,
        busynessLabel: 'Quiet',
        description: 'Comfortable soft seating near the windows for lighter work.',
      },
      {
        id: '2b',
        name: 'Group Tables',
        tags: ['Group work', 'Outlets', 'Collaborative'],
        busyness: 55,
        busynessLabel: 'Moderate',
        description: 'Best area for collaborative work and discussion between classes.',
      },
    ],
  },
  {
    id: '3',
    name: 'Tandon MakerSpace',
    building: 'Dibner Library',
    address: '5 MetroTech Center',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=5+MetroTech+Center+Brooklyn+NY',
    rating: 4.6,
    reviewCount: 61,
    busyness: 80,
    busynessLabel: 'Busy',
    noiseLevel: 'Loud',
    hasOutlets: true,
    hasWifi: true,
    groupFriendly: true,
    description:
      'Open workspace with 3D printers and whiteboards. Great for engineering projects, but it can get loud.',
    amenities: ['Outlets', 'Strong WiFi', 'Whiteboards', '3D Printers'],
    hours: [
      { day: 'Mon – Fri', time: '9:00 AM – 10:00 PM' },
      { day: 'Saturday',  time: '10:00 AM – 6:00 PM' },
      { day: 'Sunday',    time: 'Closed' },
    ],
    imageUrl: 'https://picsum.photos/seed/spot3/600/300',
  },
  {
    id: '4',
    name: 'Weinstein Study Room',
    building: 'Weinstein Hall',
    address: '5 University Pl',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=5+University+Pl+New+York+NY',
    rating: 3.5,
    reviewCount: 23,
    busyness: 20,
    busynessLabel: 'Quiet',
    noiseLevel: 'Quiet',
    hasOutlets: true,
    hasWifi: false,
    groupFriendly: false,
    description:
      'Small, quiet study room in the residence hall basement. Often overlooked — a hidden gem during exams.',
    amenities: ['Outlets', 'WiFi', 'Quiet Zone'],
    hours: [
      { day: 'Mon – Sun', time: '24 Hours' },
    ],
    imageUrl: 'https://picsum.photos/seed/spot4/600/300',
  },
];

export const FILTER_OPTIONS = ['Quiet', 'Outlets', 'Strong WiFi', 'Open Now', 'Group Tables'];
export const BUSYNESS_LEVELS = ['Empty', 'Light', 'Moderate', 'Packed'];

export function buildNewSpot({ spotName, address, hours, description }, filename) {
  return {
    id: String(Date.now()),
    name: spotName,
    building: spotName,
    address,
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
    rating: 0,
    reviewCount: 0,
    busyness: 0,
    busynessLabel: 'Empty',
    noiseLevel: 'Unknown',
    hasOutlets: false,
    hasWifi: false,
    groupFriendly: false,
    description,
    amenities: [],
    hours: [{ day: 'See listing', time: hours }],
    imageUrl: filename ? `/static/uploads/${filename}` : '',
    microLocations: [],
  };
}
