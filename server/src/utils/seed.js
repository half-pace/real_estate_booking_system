import dotenv from 'dotenv';
import { sequelize } from '../config/database.js';
import '../models/index.js';
import User from '../models/User.js';
import Property from '../models/Property.js';

dotenv.config();

const seedData = async (shouldExit = false) => {
  try {
    // Ensure DB connection
    await sequelize.authenticate();
    console.log('Connected to MySQL for seeding');
    await sequelize.sync({ force: true }); // Drop and recreate all tables
    console.log('Tables recreated');

    // Create users
    const agent = await User.create({
      name: 'Chandan',
      email: 'agent@reales.com',
      password: 'password123',
      role: 'agent',
      phone: '+1 (555) 234-5678',
      bio: 'Luxury real estate specialist with 15 years of experience in premium properties.',
      avatar: '',
      verified: true
    });

    const agent2 = await User.create({
      name: 'Bhaskar',
      email: 'sarah@reales.com',
      password: 'password123',
      role: 'agent',
      phone: '+1 (555) 345-6789',
      bio: 'Award-winning real estate agent specializing in modern urban properties.',
      avatar: '',
      verified: true
    });

    await User.create({
      name: 'Ujiraj',
      email: 'user@reales.com',
      password: 'password123',
      role: 'user',
      phone: '+1 (555) 456-7890',
      verified: true
    });

    await User.create({
      name: 'Sarnajit',
      email: 'admin@reales.com',
      password: 'password123',
      role: 'admin',
      verified: true
    });

    // Create properties
    const properties = [
      {
        title: 'The Pinnacle Penthouse Suite',
        description: 'Experience unrivaled luxury in this breathtaking penthouse suite atop one of Manhattan\'s most prestigious towers. Floor-to-ceiling windows offer sweeping 360-degree views of the city skyline, Central Park, and the Hudson River. The open-concept living space features custom Italian marble throughout, a chef\'s kitchen with top-of-the-line Miele appliances, and a private terrace perfect for entertaining.',
        type: 'penthouse',
        price: 2500,
        locationAddress: '432 Park Avenue, Apt PH-1',
        locationCity: 'New York',
        locationState: 'New York',
        locationCountry: 'United States',
        locationZipCode: '10022',
        locationLat: 40.7614,
        locationLng: -73.9718,
        bedrooms: 4,
        bathrooms: 5,
        area: 6500,
        parking: 2,
        furnished: true,
        amenities: ['Pool', 'Gym', 'Concierge', 'Rooftop Terrace', 'Wine Cellar', 'Private Elevator', 'Smart Home', 'Spa'],
        images: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&h=800&fit=crop'
        ],
        mainImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop',
        status: 'available',
        agentId: agent.id,
        views: 1250,
        rating: 4.9,
        reviewCount: 28,
        featured: true
      },
      {
        title: 'Modern Oceanfront Villa',
        description: 'A stunning architectural masterpiece perched on the Malibu coastline with direct beach access. This contemporary villa seamlessly blends indoor and outdoor living with retractable glass walls, infinity pool overlooking the Pacific, and a private garden oasis.',
        type: 'villa',
        price: 1800,
        locationAddress: '21500 Pacific Coast Hwy',
        locationCity: 'Malibu',
        locationState: 'California',
        locationCountry: 'United States',
        locationZipCode: '90265',
        locationLat: 34.0259,
        locationLng: -118.7798,
        bedrooms: 5,
        bathrooms: 6,
        area: 8200,
        parking: 3,
        furnished: true,
        amenities: ['Beach Access', 'Infinity Pool', 'Home Theater', 'Wine Cellar', 'Outdoor Kitchen', 'Fire Pit', 'Smart Home', 'Garden'],
        images: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop'
        ],
        mainImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop',
        status: 'available',
        agentId: agent.id,
        views: 980,
        rating: 4.8,
        reviewCount: 19,
        featured: true
      },
      {
        title: 'Elegant Brownstone Residence',
        description: 'Step into timeless elegance in this meticulously restored brownstone in Boston\'s historic Back Bay neighborhood. Original architectural details including ornate crown moldings, marble fireplaces, and a grand staircase blend harmoniously with modern amenities.',
        type: 'house',
        price: 850,
        locationAddress: '142 Commonwealth Ave',
        locationCity: 'Boston',
        locationState: 'Massachusetts',
        locationCountry: 'United States',
        locationZipCode: '02116',
        locationLat: 42.3519,
        locationLng: -71.0753,
        bedrooms: 4,
        bathrooms: 3,
        area: 4200,
        parking: 1,
        furnished: false,
        amenities: ['Fireplace', 'Garden', 'Library', 'Wine Storage', 'Laundry', 'Storage', 'Historic'],
        images: [
          'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&h=800&fit=crop'
        ],
        mainImage: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&h=800&fit=crop',
        status: 'available',
        agentId: agent2.id,
        views: 720,
        rating: 4.7,
        reviewCount: 15,
        featured: true
      },
      {
        title: 'SoHo Luxury Loft',
        description: 'An extraordinary loft space in the heart of SoHo featuring soaring 14-foot ceilings, exposed brick walls, and oversized factory windows flooding the space with natural light. The open floor plan encompasses a gourmet kitchen with waterfall marble island.',
        type: 'apartment',
        price: 1200,
        locationAddress: '72 Mercer Street, Loft 4A',
        locationCity: 'New York',
        locationState: 'New York',
        locationCountry: 'United States',
        locationZipCode: '10012',
        locationLat: 40.7230,
        locationLng: -73.9995,
        bedrooms: 2,
        bathrooms: 2,
        area: 2800,
        parking: 0,
        furnished: true,
        amenities: ['Doorman', 'Gym', 'Roof Deck', 'Smart Home', 'Laundry', 'Pet Friendly', 'Bike Storage'],
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop'
        ],
        mainImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
        status: 'available',
        agentId: agent2.id,
        views: 1100,
        rating: 4.6,
        reviewCount: 22,
        featured: true
      },
      {
        title: 'Mediterranean Estate',
        description: 'An enchanting Mediterranean estate set on two acres of manicured grounds in Beverly Hills. This architectural gem features arched doorways, hand-painted tiles, and a grand courtyard with a mosaic-tiled fountain.',
        type: 'villa',
        price: 3200,
        locationAddress: '1200 Benedict Canyon Dr',
        locationCity: 'Beverly Hills',
        locationState: 'California',
        locationCountry: 'United States',
        locationZipCode: '90210',
        locationLat: 34.0901,
        locationLng: -118.4065,
        bedrooms: 7,
        bathrooms: 8,
        area: 12000,
        parking: 4,
        furnished: true,
        amenities: ['Pool', 'Spa', 'Tennis Court', 'Guest House', 'Wine Cellar', 'Home Theater', 'Security', 'Garden'],
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&h=800&fit=crop'
        ],
        mainImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop',
        status: 'available',
        agentId: agent.id,
        views: 890,
        rating: 4.9,
        reviewCount: 12,
        featured: true
      },
      {
        title: 'Skyline View Condo',
        description: 'A sleek and sophisticated condominium in downtown Chicago\'s most coveted high-rise. The unit boasts panoramic lake and skyline views from every room, premium hardwood floors, and a designer kitchen.',
        type: 'condo',
        price: 650,
        locationAddress: '60 E Lake Shore Dr, Unit 42B',
        locationCity: 'Chicago',
        locationState: 'Illinois',
        locationCountry: 'United States',
        locationZipCode: '60611',
        locationLat: 41.8990,
        locationLng: -87.6170,
        bedrooms: 3,
        bathrooms: 2,
        area: 2200,
        parking: 1,
        furnished: false,
        amenities: ['Pool', 'Gym', 'Doorman', 'Concierge', 'Valet', 'Dog Run', 'Business Center'],
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=1200&h=800&fit=crop'
        ],
        mainImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop',
        status: 'available',
        agentId: agent2.id,
        views: 550,
        rating: 4.5,
        reviewCount: 18,
        featured: false
      },
      {
        title: 'Minimalist Studio Retreat',
        description: 'A beautifully designed studio apartment in San Francisco\'s vibrant Mission District. The space maximizes every square foot with custom built-in storage, a Murphy bed system, and a compact gourmet kitchen.',
        type: 'studio',
        price: 180,
        locationAddress: '2300 Mission Street, Unit 8C',
        locationCity: 'San Francisco',
        locationState: 'California',
        locationCountry: 'United States',
        locationZipCode: '94110',
        locationLat: 37.7599,
        locationLng: -122.4148,
        bedrooms: 0,
        bathrooms: 1,
        area: 550,
        parking: 0,
        furnished: true,
        amenities: ['Gym', 'Rooftop', 'Laundry', 'Bike Storage', 'Pet Friendly', 'Co-Working Space'],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&h=800&fit=crop'
        ],
        mainImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop',
        status: 'available',
        agentId: agent.id,
        views: 430,
        rating: 4.3,
        reviewCount: 31,
        featured: false
      },
      {
        title: 'Lakeside Modern Mansion',
        description: 'A stunning contemporary mansion on the shores of Lake Austin. This architectural marvel features walls of glass that frame spectacular lake views, an open-concept great room with double-height ceilings, and seamless indoor-outdoor flow.',
        type: 'house',
        price: 1500,
        locationAddress: '4500 Lakeshore Blvd',
        locationCity: 'Austin',
        locationState: 'Texas',
        locationCountry: 'United States',
        locationZipCode: '78730',
        locationLat: 30.3458,
        locationLng: -97.7995,
        bedrooms: 5,
        bathrooms: 5,
        area: 7800,
        parking: 3,
        furnished: true,
        amenities: ['Lake Access', 'Infinity Pool', 'Dock', 'Home Theater', 'Gym', 'Smart Home', 'Outdoor Kitchen'],
        images: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=800&fit=crop'
        ],
        mainImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop',
        status: 'available',
        agentId: agent2.id,
        views: 670,
        rating: 4.8,
        reviewCount: 9,
        featured: true
      },
      {
        title: 'Art Deco Boutique Apartment',
        description: 'Experience the glamour of Miami\'s Art Deco era in this exquisitely renovated apartment in South Beach. Original architectural details have been lovingly preserved while the interior has been updated with contemporary luxury finishes.',
        type: 'apartment',
        price: 420,
        locationAddress: '1220 Ocean Drive, Apt 5B',
        locationCity: 'Miami Beach',
        locationState: 'Florida',
        locationCountry: 'United States',
        locationZipCode: '33139',
        locationLat: 25.7825,
        locationLng: -80.1303,
        bedrooms: 2,
        bathrooms: 2,
        area: 1400,
        parking: 1,
        furnished: true,
        amenities: ['Beach Access', 'Pool', 'Gym', 'Concierge', 'Valet', 'Pet Friendly'],
        images: [
          'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1200&h=800&fit=crop'
        ],
        mainImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=800&fit=crop',
        status: 'available',
        agentId: agent.id,
        views: 815,
        rating: 4.4,
        reviewCount: 26,
        featured: false
      },
      {
        title: 'Mountain Chalet Retreat',
        description: 'A breathtaking mountain chalet nestled in the Aspen highlands with ski-in, ski-out access. Massive timber beams, floor-to-ceiling stone fireplace, and panoramic mountain views create the ultimate alpine luxury experience.',
        type: 'house',
        price: 2200,
        locationAddress: '300 Aspen Mountain Rd',
        locationCity: 'Aspen',
        locationState: 'Colorado',
        locationCountry: 'United States',
        locationZipCode: '81611',
        locationLat: 39.1911,
        locationLng: -106.8175,
        bedrooms: 6,
        bathrooms: 7,
        area: 9500,
        parking: 2,
        furnished: true,
        amenities: ['Ski Access', 'Hot Tub', 'Heated Pool', 'Home Theater', 'Wine Cellar', 'Fireplace', 'Sauna', 'Game Room'],
        images: [
          'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1200&h=800&fit=crop'
        ],
        mainImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&h=800&fit=crop',
        status: 'available',
        agentId: agent2.id,
        views: 920,
        rating: 4.9,
        reviewCount: 14,
        featured: true
      },
      {
        title: 'Urban Glass Tower Residence',
        description: 'Live above the clouds in this spectacular glass-walled residence in downtown Seattle. Unobstructed views of the Space Needle, Elliott Bay, and Mount Rainier.',
        type: 'condo',
        price: 780,
        locationAddress: '1500 4th Avenue, Unit 50A',
        locationCity: 'Seattle',
        locationState: 'Washington',
        locationCountry: 'United States',
        locationZipCode: '98101',
        locationLat: 47.6101,
        locationLng: -122.3331,
        bedrooms: 2,
        bathrooms: 2,
        area: 1800,
        parking: 1,
        furnished: false,
        amenities: ['Concierge', 'Gym', 'Pool', 'Sky Lounge', 'Valet', 'Pet Spa', 'Business Center'],
        images: [
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&h=800&fit=crop'
        ],
        mainImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop',
        status: 'available',
        agentId: agent.id,
        views: 460,
        rating: 4.6,
        reviewCount: 11,
        featured: false
      },
      {
        title: 'Historic French Quarter Gem',
        description: 'A beautifully restored 19th-century Creole townhouse in the heart of the French Quarter. Original cypress floors, exposed brick, and ornate ironwork balconies preserve the home\'s historic charm.',
        type: 'house',
        price: 520,
        locationAddress: '832 Royal Street',
        locationCity: 'New Orleans',
        locationState: 'Louisiana',
        locationCountry: 'United States',
        locationZipCode: '70116',
        locationLat: 29.9587,
        locationLng: -90.0632,
        bedrooms: 3,
        bathrooms: 3,
        area: 3200,
        parking: 0,
        furnished: true,
        amenities: ['Courtyard', 'Balcony', 'Fireplace', 'Library', 'Historic', 'Garden', 'Laundry'],
        images: [
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&h=800&fit=crop'
        ],
        mainImage: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&h=800&fit=crop',
        status: 'available',
        agentId: agent2.id,
        views: 380,
        rating: 4.7,
        reviewCount: 20,
        featured: false
      }
    ];

    // Create properties one by one (Sequelize bulkCreate doesn't trigger hooks by default)
    for (const propData of properties) {
      await Property.create(propData);
    }

    console.log('✅ Seed data inserted successfully!');
    console.log(`Created ${properties.length} properties`);
    console.log('Test accounts:');
    console.log('  Agent: agent@reales.com / password123');
    console.log('  User: user@reales.com / password123');
    console.log('  Admin: admin@reales.com / password123');
    if (shouldExit) process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    if (shouldExit) process.exit(1);
    throw error;
  }
};

export default seedData;

// Run automatically if this file is executed directly
const isDirectRun = process.argv[1] && (
  process.argv[1].endsWith('seed.js') ||
  process.argv[1].includes('seed')
);

if (isDirectRun) {
  seedData(true);
}
