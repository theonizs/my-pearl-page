export interface ProductMetadata {
  pearlType: 'South Sea' | 'Akoya' | 'Freshwater' | 'Tahitian';
  length: string;
  grade: 'AAA' | 'AA+' | 'AA';
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  images: string[];
  colors: string[];
  metadata: ProductMetadata;
}

export const mockProducts: Product[] = [
  {
    id: 'p-001',
    name: 'Royal South Sea Strand',
    slug: 'royal-south-sea-strand',
    price: 12500,
    description: 'A magnificent strand of Golden South Sea pearls, graduated from 12mm to 15mm. Each pearl is hand-selected for its deep golden luster and perfect roundness.',
    category: 'Necklaces',
    stock: 5,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'
    ],
    colors: ['Gold'],
    metadata: {
      pearlType: 'South Sea',
      length: '18 inch',
      grade: 'AAA'
    }
  },
  {
    id: 'p-002',
    name: 'Akoya Classic Studs',
    slug: 'akoya-classic-studs',
    price: 850,
    description: 'Timeless Akoya pearl stud earrings set in 18k white gold. The perfect essential for any collection, featuring brilliant mirror-like luster.',
    category: 'Earrings',
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80'
    ],
    colors: ['White', 'Cream'],
    metadata: {
      pearlType: 'Akoya',
      length: 'N/A',
      grade: 'AAA'
    }
  },
  {
    id: 'p-003',
    name: 'Tahitian Black Pearl Ring',
    slug: 'tahitian-black-pearl-ring',
    price: 2400,
    description: 'A striking 11mm Tahitian black pearl with peacock overtones, set in a modern 18k yellow gold bypass ring design.',
    category: 'Rings',
    stock: 3,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'
    ],
    colors: ['Black'],
    metadata: {
      pearlType: 'Tahitian',
      length: 'N/A',
      grade: 'AA+'
    }
  },
  {
    id: 'p-004',
    name: 'Freshwater Baroque Bracelet',
    slug: 'freshwater-baroque-bracelet',
    price: 550,
    description: 'Organic and unique, this bracelet features large baroque freshwater pearls with intense rainbow iridescence, finished with a gold toggle clasp.',
    category: 'Bracelets',
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80'
    ],
    colors: ['White', 'Multicolor'],
    metadata: {
      pearlType: 'Freshwater',
      length: '7.5 inch',
      grade: 'AA'
    }
  },
  {
    id: 'p-005',
    name: 'Golden Drop Earrings',
    slug: 'golden-drop-earrings',
    price: 4500,
    description: 'Elegant drop earrings featuring matched 10mm Golden South Sea pearls suspended from artisan-crafted diamond-accented gold hooks.',
    category: 'Earrings',
    stock: 4,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80'
    ],
    colors: ['Gold'],
    metadata: {
      pearlType: 'South Sea',
      length: 'N/A',
      grade: 'AAA'
    }
  },
  {
    id: 'p-006',
    name: 'Silver Tahitian Bracelet',
    slug: 'silver-tahitian-bracelet',
    price: 1200,
    description: 'A contemporary bracelet featuring silver-grey Tahitian pearls spaced with white gold beads. Perfect for modern, everyday elegance.',
    category: 'Bracelets',
    stock: 6,
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80&v=2',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80'
    ],
    colors: ['Black'],
    metadata: {
      pearlType: 'Tahitian',
      length: '7 inch',
      grade: 'AA+'
    }
  },
  {
    id: 'p-007',
    name: 'Blush Freshwater Strand',
    slug: 'blush-freshwater-strand',
    price: 650,
    description: 'A charming necklace of pastel pink and cream freshwater pearls. The soft hues compliment any skin tone and break away from tradition.',
    category: 'Necklaces',
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80&v=3',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'
    ],
    colors: ['Cream', 'Multicolor'],
    metadata: {
      pearlType: 'Freshwater',
      length: '18 inch',
      grade: 'AA'
    }
  },
  {
    id: 'p-008',
    name: 'Diamond & Pearl Ring',
    slug: 'diamond-pearl-ring',
    price: 2800,
    description: 'A central 9mm Akoya pearl flanked by brilliant-cut diamonds. A classic engagement ring alternative or a luxurious statement piece.',
    category: 'Rings',
    stock: 2,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80&v=2',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'
    ],
    colors: ['White'],
    metadata: {
      pearlType: 'Akoya',
      length: 'N/A',
      grade: 'AAA'
    }
  },
  {
    id: 'p-009',
    name: 'Baroque Statement Necklace',
    slug: 'baroque-statement-necklace',
    price: 850,
    description: 'Bold and beautiful, this necklace features large, irregular Baroque pearls that catch the light from every angle. A true conversation starter.',
    category: 'Necklaces',
    stock: 7,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80&v=4',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80'
    ],
    colors: ['White'],
    metadata: {
      pearlType: 'Freshwater',
      length: '20 inch',
      grade: 'AA'
    }
  },
  {
    id: 'p-010',
    name: 'Opera Length Akoya',
    slug: 'opera-length-akoya',
    price: 4500,
    description: 'Luxurious 30-inch strand of fine Akoya pearls. Can be worn long or doubled for a layered look. The epitome of versatility and class.',
    category: 'Necklaces',
    stock: 3,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80&v=5',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'
    ],
    colors: ['White', 'Cream'],
    metadata: {
      pearlType: 'Akoya',
      length: '30 inch',
      grade: 'AAA'
    }
  },
  {
    id: 'p-011',
    name: 'Champagne South Sea Studs',
    slug: 'champagne-south-sea-studs',
    price: 1800,
    description: 'Exquisite 11mm South Sea pearls with a warm champagne hue. Simple, elegant, and breathtakingly lustrous.',
    category: 'Earrings',
    stock: 6,
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80&v=2',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80'
    ],
    colors: ['Cream', 'Gold'],
    metadata: {
      pearlType: 'South Sea',
      length: 'N/A',
      grade: 'AAA'
    }
  },
  {
    id: 'p-012',
    name: 'Midnight Pearl Pendant',
    slug: 'midnight-pearl-pendant',
    price: 950,
    description: 'A single, perfect 10mm Tahitian pearl suspended from a delicate white gold chain. Minimalist yet powerful.',
    category: 'Necklaces',
    stock: 10,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80&v=5',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'
    ],
    colors: ['Black'],
    metadata: {
      pearlType: 'Tahitian',
      length: '18 inch',
      grade: 'AA+'
    }
  },
  {
    id: 'p-013',
    name: 'Double Strand Bracelet',
    slug: 'double-strand-bracelet',
    price: 1500,
    description: 'Two rows of matched Akoya pearls held together by a vintage-inspired clasp. A sophisticated accessory for formal occasions.',
    category: 'Bracelets',
    stock: 4,
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80&v=3',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80'
    ],
    colors: ['White'],
    metadata: {
      pearlType: 'Akoya',
      length: '7 inch',
      grade: 'AAA'
    }
  },
  {
    id: 'p-014',
    name: 'Royal Halo Ring',
    slug: 'royal-halo-ring',
    price: 15000,
    description: 'The crown jewel of our collection. A massive 14mm Golden South Sea pearl surrounded by a double halo of VVS diamonds.',
    category: 'Rings',
    stock: 1,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80&v=4',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'
    ],
    colors: ['Gold'],
    metadata: {
      pearlType: 'South Sea',
      length: 'N/A',
      grade: 'AAA'
    }
  },
  {
    id: 'p-015',
    name: 'Multicolor Rope Necklace',
    slug: 'multicolor-rope-necklace',
    price: 1200,
    description: 'Fun and fashionable, this rope-length necklace features Freshwater pearls in naturally occurring shades of peach, lavender, and white.',
    category: 'Necklaces',
    stock: 5,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80&v=6',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80'
    ],
    colors: ['Multicolor'],
    metadata: {
      pearlType: 'Freshwater',
      length: '36 inch',
      grade: 'AA'
    }
  },
  {
    id: 'p-016',
    name: 'Tahitian Studs',
    slug: 'tahitian-studs',
    price: 800,
    description: 'Simple 9mm Tahitian pearl studs. Dark, mysterious, and perfect for adding an edge to any outfit.',
    category: 'Earrings',
    stock: 10,
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80&v=4',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80'
    ],
    colors: ['Black'],
    metadata: {
      pearlType: 'Tahitian',
      length: 'N/A',
      grade: 'AAA'
    }
  },
  {
    id: 'p-017',
    name: 'Bridal Akoya Set',
    slug: 'bridal-akoya-set',
    price: 8500,
    description: 'The ultimate wedding day luxury. Matches a perfect Akoya strand with diamond-accented earrings. Heirloom quality.',
    category: 'Necklaces',
    stock: 2,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80&v=7',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'
    ],
    colors: ['White'],
    metadata: {
      pearlType: 'Akoya',
      length: '18 inch',
      grade: 'AAA'
    }
  },
  {
    id: 'p-018',
    name: 'Golden Harvest Ring',
    slug: 'golden-harvest-ring',
    price: 5500,
    description: 'Inspired by wheat fields, this gold band holds a 12mm Golden South Sea pearl in a warm embrace of yellow gold leaves.',
    category: 'Rings',
    stock: 3,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80&v=6',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'
    ],
    colors: ['Gold'],
    metadata: {
      pearlType: 'South Sea',
      length: 'N/A',
      grade: 'AA+'
    }
  },
  {
    id: 'p-019',
    name: 'Petite Drop Pendant',
    slug: 'petite-drop-pendant',
    price: 600,
    description: 'A delicate teardrop-shaped Freshwater pearl on a fine chain. Subtle elegance for everyday wear.',
    category: 'Necklaces',
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80&v=7',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'
    ],
    colors: ['White', 'Cream'],
    metadata: {
      pearlType: 'Freshwater',
      length: '16 inch',
      grade: 'AAA'
    }
  },
  {
    id: 'p-020',
    name: 'Luxury South Sea Strand',
    slug: 'luxury-south-sea-strand',
    price: 95000,
    description: 'Unrivaled perfection. A matched strand of 16mm-18mm White South Sea pearls. The rarest of the rare, for the discerning collector.',
    category: 'Necklaces',
    stock: 1,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80&v=8',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'
    ],
    colors: ['White'],
    metadata: {
      pearlType: 'South Sea',
      length: '20 inch',
      grade: 'AAA'
    }
  }
];
