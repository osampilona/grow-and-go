export type FeedItem = {
  id: string;
  title: string;
  user: {
    userId: string;
    name: string;
    avatar: string;
  };
  price: string;
  rating: number;
  condition: 'brand-new' | 'like-new' | 'very-good' | 'good' | 'fair';
  images: string[];
};

const mockFeed: FeedItem[] = [
  {
    id: '1',
    title: 'Baby clothes (0-24 months)',
    user: {
      userId: 'u1',
      name: 'Anna',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    },
    price: 'DKK753',
    rating: 4.9,
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
    user: {
      userId: 'u2',
      name: 'Ben',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    },
    price: 'DKK500',
    rating: 4.7,
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
    user: {
      userId: 'u3',
      name: 'Clara',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
    },
    price: 'DKK120',
    rating: 4.8,
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
    user: {
      userId: 'u4',
      name: 'Dina',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267050',
    },
    price: 'DKK80',
    rating: 4.6,
    condition: 'good',
    images: [
      'https://images.pexels.com/photos/3933271/pexels-photo-3933271.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933274/pexels-photo-3933274.jpeg?auto=compress&w=400&q=80',
    ],
  },
  {
    id: '5',
    title: 'Baby shoes',
    user: {
      userId: 'u5',
      name: 'Ella',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267051',
    },
    price: 'DKK200',
    rating: 4.5,
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
    user: {
      userId: 'u6',
      name: 'Fiona',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267052',
    },
    price: 'DKK150',
    rating: 4.9,
    condition: 'fair',
    images: [
      'https://images.pexels.com/photos/3933274/pexels-photo-3933274.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933275/pexels-photo-3933275.jpeg?auto=compress&w=400&q=80',
    ],
  },
  {
    id: '7',
    title: 'Baby stroller',
    user: {
      userId: 'u7',
      name: 'George',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267053',
    },
    price: 'DKK1200',
    rating: 4.4,
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
    user: {
      userId: 'u8',
      name: 'Hannah',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267054',
    },
    price: 'DKK1800',
    rating: 4.8,
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
    user: {
      userId: 'u9',
      name: 'Ivan',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267055',
    },
    price: 'DKK600',
    rating: 4.7,
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
    user: {
      userId: 'u10',
      name: 'Julia',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267056',
    },
    price: 'DKK350',
    rating: 4.6,
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
    user: {
      userId: 'u11',
      name: 'Klara',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267057',
    },
    price: 'DKK400',
    rating: 4.5,
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
    user: {
      userId: 'u12',
      name: 'Leo',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267058',
    },
    price: 'DKK900',
    rating: 4.7,
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
    user: {
      userId: 'u13',
      name: 'Maja',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267059',
    },
    price: 'DKK700',
    rating: 4.6,
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
    user: {
      userId: 'u14',
      name: 'Nina',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267060',
    },
    price: 'DKK1100',
    rating: 4.8,
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
    user: {
      userId: 'u15',
      name: 'Oskar',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267061',
    },
    price: 'DKK180',
    rating: 4.7,
    condition: 'good',
    images: [
      'https://images.pexels.com/photos/3933273/pexels-photo-3933273.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/459976/pexels-photo-459976.jpeg?auto=compress&w=400&q=80',
    ],
  },
  {
    id: '16',
    title: 'Baby sleeping bag',
    user: {
      userId: 'u16',
      name: 'Petra',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267062',
    },
    price: 'DKK250',
    rating: 4.9,
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
    user: {
      userId: 'u17',
      name: 'Quinn',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267063',
    },
    price: 'DKK90',
    rating: 4.5,
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
    user: {
      userId: 'u18',
      name: 'Rosa',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267064',
    },
    price: 'DKK60',
    rating: 4.6,
    condition: 'brand-new',
    images: [
      'https://images.pexels.com/photos/3933273/pexels-photo-3933273.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933274/pexels-photo-3933274.jpeg?auto=compress&w=400&q=80',
    ],
  },
  {
    id: '19',
    title: 'Baby hat',
    user: {
      userId: 'u19',
      name: 'Sara',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267065',
    },
    price: 'DKK70',
    rating: 4.7,
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
    user: {
      userId: 'u20',
      name: 'Tina',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267066',
    },
    price: 'DKK50',
    rating: 4.8,
    condition: 'good',
    images: [
      'https://images.pexels.com/photos/3933275/pexels-photo-3933275.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933272/pexels-photo-3933272.jpeg?auto=compress&w=400&q=80',
    ],
  },
  {
    id: '21',
    title: 'Baby bathrobe',
    user: {
      userId: 'u21',
      name: 'Uma',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267067',
    },
    price: 'DKK130',
    rating: 4.6,
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
    user: {
      userId: 'u22',
      name: 'Vera',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267068',
    },
    price: 'DKK40',
    rating: 4.7,
    condition: 'brand-new',
    images: [
      'https://images.pexels.com/photos/459976/pexels-photo-459976.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/3933271/pexels-photo-3933271.jpeg?auto=compress&w=400&q=80',
    ],
  },
  {
    id: '23',
    title: 'Baby lotion',
    user: {
      userId: 'u23',
      name: 'Wendy',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267069',
    },
    price: 'DKK55',
    rating: 4.8,
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
    user: {
      userId: 'u24',
      name: 'Xenia',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267070',
    },
    price: 'DKK35',
    rating: 4.6,
    condition: 'like-new',
    images: [
      'https://images.pexels.com/photos/3933273/pexels-photo-3933273.jpeg?auto=compress&w=400&q=80',
      'https://images.pexels.com/photos/1556706/pexels-photo-1556706.jpeg?auto=compress&w=400&q=80',
    ],
  },
  {
    id: '25',
    title: 'Baby teether',
    user: {
      userId: 'u25',
      name: 'Yara',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267071',
    },
    price: 'DKK65',
    rating: 4.9,
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
