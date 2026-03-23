/**
 * Mock spot data
 *
 * This file will be replaced by real API calls during the back-end sprint.
 */

export const MOCK_SPOTS = [
  {
    id: '1',
    name: 'Bobst Library — 3rd Floor',
    building: 'Bobst Library',
    address: '70 Washington Square S',
    rating: 4.3,
    reviewCount: 84,
    busyness: 65,
    busynessLabel: 'Moderate',
    description:
      'Bright, open floor with plenty of table seating and individual carrels. ' +
      'Great natural light from the atrium. Gets busy around midterms but the ' +
      'upper mezzanine usually has open spots.',
    amenities: ['Outlets', 'Strong WiFi', 'Quiet Zone', 'Accessible'],
    hours: [
      { day: 'Mon – Thu', time: '8:00 AM – 2:00 AM' },
      { day: 'Friday', time: '8:00 AM – 10:00 PM' },
      { day: 'Saturday', time: '10:00 AM – 10:00 PM' },
      { day: 'Sunday', time: '10:00 AM – 2:00 AM' },
    ],
    imageUrl: 'https://picsum.photos/seed/spot1/600/300',
  },
  {
    id: '2',
    name: 'Kimmel Center — 4th Floor Lounge',
    building: 'Kimmel Center',
    address: '60 Washington Square S',
    rating: 3.8,
    reviewCount: 42,
    busyness: 40,
    busynessLabel: 'Light',
    description:
      'Comfortable lounge seating with a quieter vibe. Good for group work or solo reading between classes.',
    amenities: ['Outlets', 'WiFi', 'Group Tables'],
    hours: [
      { day: 'Mon – Fri', time: '7:00 AM – 11:00 PM' },
      { day: 'Sat – Sun', time: '9:00 AM – 9:00 PM' },
    ],
    imageUrl: 'https://picsum.photos/seed/spot2/600/300',
  },
  {
    id: '3',
    name: 'Tandon MakerSpace',
    building: 'Dibner Library',
    address: '5 MetroTech Center',
    rating: 4.6,
    reviewCount: 61,
    busyness: 80,
    busynessLabel: 'Packed',
    description:
      'Open workspace with 3D printers and whiteboards. Great for engineering projects, but it can get loud.',
    amenities: ['Outlets', 'Strong WiFi', 'Whiteboards', '3D Printers'],
    hours: [
      { day: 'Mon – Fri', time: '9:00 AM – 10:00 PM' },
      { day: 'Saturday', time: '10:00 AM – 6:00 PM' },
      { day: 'Sunday', time: 'Closed' },
    ],
    imageUrl: 'https://picsum.photos/seed/spot3/600/300',
  },
  {
    id: '4',
    name: 'Weinstein Study Room',
    building: 'Weinstein Hall',
    address: '5 University Pl',
    rating: 3.5,
    reviewCount: 23,
    busyness: 20,
    busynessLabel: 'Empty',
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
