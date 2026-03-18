// Mock data for CebSpot app

export interface Place {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  rating: number;
  visitCount: number;
  description: string;
  priceRange: string;
  requiresReservation: boolean;
  address: string;
}

export interface Review {
  id: string;
  placeId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  lat: number;
  lng: number;
  lastSeen: string;
  status: string;
}

export interface RideHailingApp {
  id: string;
  name: string;
  icon: string;
  estimatedFare: number;
  estimatedTime: string;
  deepLink: string;
}

// Cebu City center coordinates
export const CEBU_CENTER = { lat: 10.3157, lng: 123.8854 };

export const mockPlaces: Place[] = [
  {
    id: '1',
    name: 'Larsian BBQ',
    category: 'streetfood',
    lat: 10.3058,
    lng: 123.8933,
    rating: 4.5,
    visitCount: 1250,
    description: 'Famous street BBQ spot with authentic Filipino grilled favorites',
    priceRange: '₱',
    requiresReservation: false,
    address: 'P. del Rosario St, Cebu City'
  },
  {
    id: '2',
    name: 'The Social',
    category: 'coffee shop',
    lat: 10.3175,
    lng: 123.8932,
    rating: 4.7,
    visitCount: 890,
    description: 'Trendy coffee shop with artisan brews and cozy ambiance',
    priceRange: '₱₱',
    requiresReservation: false,
    address: 'Archbishop Reyes Ave, Cebu City'
  },
  {
    id: '3',
    name: 'Anzani',
    category: 'fine dining',
    lat: 10.3283,
    lng: 123.8956,
    rating: 4.8,
    visitCount: 456,
    description: 'Upscale Mediterranean restaurant with stunning city views',
    priceRange: '₱₱₱₱',
    requiresReservation: true,
    address: 'Busay, Cebu City'
  },
  {
    id: '4',
    name: 'Liv Super Club',
    category: 'club',
    lat: 10.3152,
    lng: 123.9055,
    rating: 4.3,
    visitCount: 678,
    description: 'Premier nightclub with international DJs and VIP sections',
    priceRange: '₱₱₱',
    requiresReservation: true,
    address: 'The Venue Mall, AS Fortuna St'
  },
  {
    id: '5',
    name: 'Tuslob Buwa Central',
    category: 'streetfood',
    lat: 10.3011,
    lng: 123.8871,
    rating: 4.6,
    visitCount: 1520,
    description: 'Iconic Cebuano street food experience',
    priceRange: '₱',
    requiresReservation: false,
    address: 'Tres de Abril St, Cebu City'
  },
  {
    id: '6',
    name: 'Yardstick Coffee',
    category: 'coffee shop',
    lat: 10.3198,
    lng: 123.9012,
    rating: 4.5,
    visitCount: 723,
    description: 'Specialty coffee roaster with locally sourced beans',
    priceRange: '₱₱',
    requiresReservation: false,
    address: 'Banilad, Cebu City'
  },
  {
    id: '7',
    name: 'Tops Lookout',
    category: 'sightseeing',
    lat: 10.3456,
    lng: 123.8765,
    rating: 4.9,
    visitCount: 2340,
    description: 'Breathtaking panoramic view of Cebu and surrounding islands',
    priceRange: '₱',
    requiresReservation: false,
    address: 'Busay, Cebu City'
  },
  {
    id: '8',
    name: 'Maya Mexican Restaurant',
    category: 'bar',
    lat: 10.3221,
    lng: 123.8954,
    rating: 4.4,
    visitCount: 567,
    description: 'Vibrant Mexican bar with authentic cuisine and margaritas',
    priceRange: '₱₱',
    requiresReservation: false,
    address: 'Crossroads, Banilad'
  },
  {
    id: '9',
    name: 'Temple of Leah',
    category: 'sightseeing',
    lat: 10.3389,
    lng: 123.8821,
    rating: 4.7,
    visitCount: 1890,
    description: 'Majestic Roman-inspired temple with stunning architecture',
    priceRange: '₱',
    requiresReservation: false,
    address: 'Busay, Cebu City'
  },
  {
    id: '10',
    name: 'Abaca Baking Company',
    category: 'coffee shop',
    lat: 10.3167,
    lng: 123.8945,
    rating: 4.6,
    visitCount: 891,
    description: 'Artisan bakery and cafe with fresh pastries daily',
    priceRange: '₱₱',
    requiresReservation: false,
    address: 'Banilad Town Centre'
  }
];

export const mockReviews: Review[] = [
  {
    id: 'r1',
    placeId: '1',
    userId: 'u1',
    userName: 'Maria Santos',
    rating: 5,
    comment: 'The pork BBQ is absolutely amazing! Best late-night food spot in Cebu.',
    date: '2026-02-14',
    helpful: 24
  },
  {
    id: 'r2',
    placeId: '1',
    userId: 'u2',
    userName: 'John Cruz',
    rating: 4,
    comment: 'Great food and atmosphere. Can get crowded on weekends.',
    date: '2026-02-12',
    helpful: 15
  },
  {
    id: 'r3',
    placeId: '2',
    userId: 'u3',
    userName: 'Anna Reyes',
    rating: 5,
    comment: 'Perfect spot for working remotely. Great coffee and fast wifi!',
    date: '2026-02-13',
    helpful: 31
  },
  {
    id: 'r4',
    placeId: '3',
    userId: 'u4',
    userName: 'David Tan',
    rating: 5,
    comment: 'Unforgettable dining experience. The sunset view is breathtaking!',
    date: '2026-02-10',
    helpful: 45
  },
  {
    id: 'r5',
    placeId: '4',
    userId: 'u5',
    userName: 'Sarah Lee',
    rating: 4,
    comment: 'Great music and vibe. VIP table reservation is worth it.',
    date: '2026-02-11',
    helpful: 19
  }
];

export const mockFriends: Friend[] = [
  {
    id: 'f1',
    name: 'Carlos Garcia',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    lat: 10.3145,
    lng: 123.8945,
    lastSeen: '2 min ago',
    status: 'At Ayala Center'
  },
  {
    id: 'f2',
    name: 'Lisa Chen',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    lat: 10.3198,
    lng: 123.9012,
    lastSeen: '15 min ago',
    status: 'Coffee at Banilad'
  },
  {
    id: 'f3',
    name: 'Miguel Torres',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    lat: 10.3221,
    lng: 123.8954,
    lastSeen: '1 hour ago',
    status: 'Dinner at Crossroads'
  }
];

export const mockRideHailingApps: RideHailingApp[] = [
  {
    id: 'grab',
    name: 'Grab',
    icon: '🟢',
    estimatedFare: 0,
    estimatedTime: '',
    deepLink: 'https://grab.com'
  },
  {
    id: 'uber',
    name: 'Uber',
    icon: '⚫',
    estimatedFare: 0,
    estimatedTime: '',
    deepLink: 'https://uber.com'
  },
  {
    id: 'angkas',
    name: 'Angkas',
    icon: '🔴',
    estimatedFare: 0,
    estimatedTime: '',
    deepLink: 'https://angkas.com'
  },
  {
    id: 'joyride',
    name: 'JoyRide',
    icon: '🟡',
    estimatedFare: 0,
    estimatedTime: '',
    deepLink: 'https://joyride.ph'
  }
];
