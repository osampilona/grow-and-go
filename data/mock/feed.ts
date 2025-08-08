export type FeedItem = {
  id: string;
  title: string;
  description: string;
  user: {
    userId: string;
    name: string;
    avatar: string;
    rating: number;
  };
  price: string;
  condition: 'brand-new' | 'like-new' | 'very-good' | 'good' | 'fair';
  images: string[];
};

export const mockFeed: FeedItem[] = [
  {
    id: '1',
    title: 'Baby clothes (0-24 months)',
    description: 'A collection of gently used baby clothes for ages 0-24 months. Soft, comfortable, and stylish.',
    user: {
      userId: '1',
      name: 'Anna',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
      rating: 4.9,
    },
    price: 'DKK753',
    condition: 'like-new',
    images: [
      'https://images.pexels.com/photos/459976/pexels-photo-459976.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/1556706/pexels-photo-1556706.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933275/pexels-photo-3933275.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933271/pexels-photo-3933271.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933272/pexels-photo-3933272.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933273/pexels-photo-3933273.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933274/pexels-photo-3933274.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933276/pexels-photo-3933276.jpeg?auto=compress&w=400&q=80',
    ],
  },
  {
    id: '2',
    title: 'Wooden baby chair',
    description: 'Sturdy and stylish wooden chair for babies. Perfect for feeding and playtime.',
    user: {
      userId: '2',
      name: 'Ben',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
      rating: 4.7,
    },
    price: 'DKK500',
    condition: 'very-good',
    images: [
      'https://images.pexels.com/photos/3933275/pexels-photo-3933275.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933271/pexels-photo-3933271.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933272/pexels-photo-3933272.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/459976/pexels-photo-459976.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/1556706/pexels-photo-1556706.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933275/pexels-photo-3933275.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933271/pexels-photo-3933271.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933272/pexels-photo-3933272.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933273/pexels-photo-3933273.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933274/pexels-photo-3933274.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933276/pexels-photo-3933276.jpeg?auto=compress&w=400&q=80',
    ],
  },
  {
    id: '3',
    title: 'Soft baby blanket',
    description: 'Brand new, ultra-soft baby blanket. Keeps your little one warm and cozy.',
    user: {
      userId: '3',
      name: 'Clara',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
      rating: 4.8,
    },
    price: 'DKK120',
    condition: 'brand-new',
    images: [
      'https://images.pexels.com/photos/1556706/pexels-photo-1556706.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/459976/pexels-photo-459976.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933273/pexels-photo-3933273.jpeg?auto=compress&w=400&q=80',
    ],
  },
  {
    id: '4',
    title: 'Eco baby bottle',
    description: 'Eco-friendly baby bottle made from safe materials. Easy to clean and use.',
    user: {
      userId: '4',
      name: 'Dina',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267050',
      rating: 4.6,
    },
    price: 'DKK80',
    condition: 'good',
    images: [
      'https://images.pexels.com/photos/3933271/pexels-photo-3933271.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933274/pexels-photo-3933274.jpeg?auto=compress&w=400&q=80',
    ],
  },
  {
    id: '5',
    title: 'Baby shoes',
    description: 'Cute and comfortable baby shoes. Like new, perfect for first steps.',
    user: {
      userId: '5',
      name: 'Ella',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267051',
      rating: 4.5,
    },
    price: 'DKK200',
    condition: 'like-new',
    images: [
      'https://images.pexels.com/photos/459976/pexels-photo-459976.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/1556706/pexels-photo-1556706.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933275/pexels-photo-3933275.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933271/pexels-photo-3933271.jpeg?auto=compress&w=400&q=80',
    ],
  },
  {
    id: '6',
    title: 'Organic baby food set',
    description: 'A set of organic baby food jars. Healthy and delicious for your little one.',
    user: {
      userId: '6',
      name: 'Fiona',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267052',
      rating: 4.9,
    },
    price: 'DKK150',
    condition: 'fair',
    images: [
      'https://images.pexels.com/photos/3933274/pexels-photo-3933274.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933275/pexels-photo-3933275.jpeg?auto=compress&w=400&q=80',
    ],
  },
  {
    id: '7',
    title: 'Baby stroller',
    description: 'Comfortable and easy-to-maneuver baby stroller. Great for walks and travel.',
    user: {
      userId: '7',
      name: 'George',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267053',
      rating: 4.4,
    },
    price: 'DKK1200',
    condition: 'very-good',
    images: [
      'https://images.pexels.com/photos/3933271/pexels-photo-3933271.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933272/pexels-photo-3933272.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/459976/pexels-photo-459976.jpeg?auto=compress&w=400&q=80',
    ],
  },
  {
    id: '8',
    title: 'Baby crib',
    description: 'Spacious and safe baby crib. Brand new, perfect for a nursery.',
    user: {
      userId: '8',
      name: 'Hannah',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267054',
      rating: 4.8,
    },
    price: 'DKK1800',
    condition: 'brand-new',
    images: [
      'https://images.pexels.com/photos/3933273/pexels-photo-3933273.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/1556706/pexels-photo-1556706.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933274/pexels-photo-3933274.jpeg?auto=compress&w=400&q=80',
    ],
  },
  {
    id: '9',
    title: 'Baby carrier',
    description: 'Ergonomic baby carrier for comfortable outings. Like new condition.',
    user: {
      userId: '9',
      name: 'Ivan',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267055',
      rating: 4.7,
    },
    price: 'DKK600',
    condition: 'like-new',
    images: [
      'https://images.pexels.com/photos/3933272/pexels-photo-3933272.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933273/pexels-photo-3933273.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/459976/pexels-photo-459976.jpeg?auto=compress&w=400&q=80',
    ],
  },
  {
    id: '10',
    title: 'Baby play mat',
    description: 'Colorful and soft play mat for babies. Great for tummy time and play.',
    user: {
      userId: '10',
      name: 'Julia',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267056',
      rating: 4.6,
    },
    price: 'DKK350',
    condition: 'good',
    images: [
      'https://images.pexels.com/photos/1556706/pexels-photo-1556706.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933274/pexels-photo-3933274.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933275/pexels-photo-3933275.jpeg?auto=compress&w=400&q=80',
    ],
  },
  {
    id: '11',
    title: 'Baby bath tub',
    description: 'Spacious baby bath tub for safe and fun bath times.',
    user: {
      userId: '11',
      name: 'Klara',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267057',
      rating: 4.5,
    },
    price: 'DKK400',
    condition: 'fair',
    images: [
      'https://images.pexels.com/photos/3933271/pexels-photo-3933271.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/459976/pexels-photo-459976.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933275/pexels-photo-3933275.jpeg?auto=compress&w=400&q=80',
    ],
  },
  {
    id: '12',
    title: 'Baby monitor',
    description: 'Reliable baby monitor with clear audio and video. Peace of mind for parents.',
    user: {
      userId: '12',
      name: 'Leo',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267058',
      rating: 4.7,
    },
    price: 'DKK900',
    condition: 'very-good',
    images: [
      'https://images.pexels.com/photos/3933272/pexels-photo-3933272.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/1556706/pexels-photo-1556706.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933273/pexels-photo-3933273.jpeg?auto=compress&w=400&q=80',
    ],
  },
  {
    id: '13',
    title: 'Baby walker',
    description: 'Brand new baby walker to help your child take their first steps safely.',
    user: {
      userId: '13',
      name: 'Maja',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267059',
      rating: 4.6,
    },
    price: 'DKK700',
    condition: 'brand-new',
    images: [
      'https://images.pexels.com/photos/3933274/pexels-photo-3933274.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/459976/pexels-photo-459976.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933271/pexels-photo-3933271.jpeg?auto=compress&w=400&q=80',
    ],
  },
  {
    id: '14',
    title: 'Baby changing table',
    description: 'Spacious changing table for easy and safe diaper changes. Like new.',
    user: {
      userId: '14',
      name: 'Nina',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267060',
      rating: 4.8,
    },
    price: 'DKK1100',
    condition: 'like-new',
    images: [
      'https://images.pexels.com/photos/3933275/pexels-photo-3933275.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933272/pexels-photo-3933272.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/1556706/pexels-photo-1556706.jpeg?auto=compress&w=400&q=80',
    ],
  },
  {
    id: '15',
    title: 'Baby feeding set',
    description: 'Complete feeding set for babies. Includes plates, spoons, and cups.',
    user: {
      userId: '15',
      name: 'Oskar',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267061',
      rating: 4.7,
    },
    price: 'DKK180',
    condition: 'good',
    images: [
      'https://images.pexels.com/photos/3933273/pexels-photo-3933273.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/459976/pexels-photo-459976.jpeg?auto=compress&w=400&q=80',
    ],
  },
  {
    id: '16',
    title: 'Baby sleeping bag',
    description: 'Warm and cozy sleeping bag for babies. Very good condition.',
    user: {
      userId: '16',
      name: 'Petra',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267062',
      rating: 4.9,
    },
    price: 'DKK250',
    condition: 'very-good',
    images: [
      'https://images.pexels.com/photos/3933274/pexels-photo-3933274.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933271/pexels-photo-3933271.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/1556706/pexels-photo-1556706.jpeg?auto=compress&w=400&q=80',
    ],
  },
  {
    id: '17',
    title: 'Baby bibs (set of 5)',
    description: 'Set of 5 colorful baby bibs. Easy to clean and comfortable.',
    user: {
      userId: '17',
      name: 'Quinn',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267063',
      rating: 4.5,
    },
    price: 'DKK90',
    condition: 'fair',
    images: [
      'https://images.pexels.com/photos/3933275/pexels-photo-3933275.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/459976/pexels-photo-459976.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933272/pexels-photo-3933272.jpeg?auto=compress&w=400&q=80',
    ],
  },
  {
    id: '18',
    title: 'Baby socks',
    description: 'Brand new set of baby socks. Soft and gentle on baby skin.',
    user: {
      userId: '18',
      name: 'Rosa',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267064',
      rating: 4.6,
    },
    price: 'DKK60',
    condition: 'brand-new',
    images: [
      'https://images.pexels.com/photos/3933273/pexels-photo-3933273.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933274/pexels-photo-3933274.jpeg?auto=compress&w=400&q=80',
    ],
  },
  {
    id: '19',
    title: 'Baby hat',
    description: 'Like new baby hat. Keeps your baby warm and stylish.',
    user: {
      userId: '19',
      name: 'Sara',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267065',
      rating: 4.7,
    },
    price: 'DKK70',
    condition: 'like-new',
    images: [
      'https://images.pexels.com/photos/1556706/pexels-photo-1556706.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933271/pexels-photo-3933271.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/459976/pexels-photo-459976.jpeg?auto=compress&w=400&q=80',
    ],
  },
  {
    id: '20',
    title: 'Baby mittens',
    description: 'Soft baby mittens to keep tiny hands warm. Good condition.',
    user: {
      userId: '20',
      name: 'Tina',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267066',
      rating: 4.8,
    },
    price: 'DKK50',
    condition: 'good',
    images: [
      'https://images.pexels.com/photos/3933275/pexels-photo-3933275.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933272/pexels-photo-3933272.jpeg?auto=compress&w=400&q=80',
    ],
  },
  {
    id: '21',
    title: 'Baby bathrobe',
    description: 'Very good condition bathrobe for babies. Soft and absorbent.',
    user: {
      userId: '21',
      name: 'Uma',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267067',
      rating: 4.6,
    },
    price: 'DKK130',
    condition: 'very-good',
    images: [
      'https://images.pexels.com/photos/3933273/pexels-photo-3933273.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933274/pexels-photo-3933274.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/1556706/pexels-photo-1556706.jpeg?auto=compress&w=400&q=80',
    ],
  },
  {
    id: '22',
    title: 'Baby shampoo',
    description: 'Gentle baby shampoo for sensitive skin. Brand new.',
    user: {
      userId: '22',
      name: 'Vera',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267068',
      rating: 4.7,
    },
    price: 'DKK40',
    condition: 'brand-new',
    images: [
      'https://images.pexels.com/photos/459976/pexels-photo-459976.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933271/pexels-photo-3933271.jpeg?auto=compress&w=400&q=80',
    ],
  },
  {
    id: '23',
    title: 'Baby lotion',
    description: 'Moisturizing baby lotion for soft and healthy skin. Fair condition.',
    user: {
      userId: '23',
      name: 'Wendy',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267069',
      rating: 4.8,
    },
    price: 'DKK55',
    condition: 'fair',
    images: [
      'https://images.pexels.com/photos/3933275/pexels-photo-3933275.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933272/pexels-photo-3933272.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933274/pexels-photo-3933274.jpeg?auto=compress&w=400&q=80',
    ],
  },
  {
    id: '24',
    title: 'Baby wipes',
    description: 'Like new baby wipes. Gentle and effective for cleaning.',
    user: {
      userId: '24',
      name: 'Xenia',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267070',
      rating: 4.6,
    },
    price: 'DKK35',
    condition: 'like-new',
    images: [
      'https://images.pexels.com/photos/3933273/pexels-photo-3933273.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/1556706/pexels-photo-1556706.jpeg?auto=compress&w=400&q=80',
    ],
  },
  {
    id: '25',
    title: 'Baby teether',
    description: 'Good condition baby teether. Soothes gums and easy to hold.',
    user: {
      userId: '25',
      name: 'Yara',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267071',
      rating: 4.9,
    },
    price: 'DKK65',
    condition: 'good',
    images: [
      'https://images.pexels.com/photos/459976/pexels-photo-459976.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933271/pexels-photo-3933271.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933275/pexels-photo-3933275.jpeg?auto=compress&w=400&q=80',
    ],
  },
];

export function fetchFeed(): Promise<FeedItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockFeed);
    }, 500);
  });
}
