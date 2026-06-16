/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LuxuryItem, CarNode, Cabana, ServiceOrder, SecurityEvent, SystemLog, EnergyTrade } from './types';

export const LUXURY_ITEMS: LuxuryItem[] = [
  // Watches
  {
    id: 'w1',
    name: 'Rolex Submariner Metric',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=300&q=80',
    category: 'watches',
    stockCount: 3,
    status: 'Low',
    price: '$14,500',
    details: 'Cerachrom bezel, black dial with high-legibility luminescent markers.'
  },
  {
    id: 'w2',
    name: 'Patek Philippe Nautilus',
    image: 'https://images.unsplash.com/photo-1547996160-817ec976267f?auto=format&fit=crop&w=300&q=80',
    category: 'watches',
    stockCount: 1,
    status: 'Critical',
    price: '$85,200',
    details: 'Self-winding mechanical calibre with signature slate-blue textured dial.'
  },
  {
    id: 'w3',
    name: 'Audemars Piguet Royal Oak',
    image: 'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&w=300&q=80',
    category: 'watches',
    stockCount: 5,
    status: 'Optimal',
    price: '$45,800',
    details: '“Grande Tapisserie” pattern, white gold applied hour-markers.'
  },
  // Jewelry
  {
    id: 'j1',
    name: 'Cartier Diamond Signature',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80',
    category: 'jewelry',
    stockCount: 2,
    status: 'Low',
    price: '$32,000',
    details: '18K white gold, paved with brilliant-cut diamonds, pear-shaped drop.'
  },
  {
    id: 'j2',
    name: 'Tiffany Solitaire Engagement',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557c?auto=format&fit=crop&w=300&q=80',
    category: 'jewelry',
    stockCount: 0,
    status: 'Out of Stock',
    price: '$18,900',
    details: 'Classic six-prong platinum setting, legendary round brilliant cut.'
  },
  {
    id: 'j3',
    name: 'Bulgari Serpenti Diamond',
    image: 'https://images.unsplash.com/photo-1535633302704-b02f4f376f70?auto=format&fit=crop&w=300&q=80',
    category: 'jewelry',
    stockCount: 4,
    status: 'Optimal',
    price: '$54,000',
    details: 'Coiled serpent in 18K rose gold with pavé diamonds and emerald eyes.'
  },
  // Fashion
  {
    id: 'f1',
    name: 'Hermès Birkin 30 Golden',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80',
    category: 'fashion',
    stockCount: 1,
    status: 'Low',
    price: '$28,500',
    details: 'Togo leather with classic gold hardware and hand-stitched seams.'
  },
  {
    id: 'f2',
    name: 'Chanel Classic Flap Caviar',
    image: 'https://images.unsplash.com/photo-1548036328-17d47671783a?auto=format&fit=crop&w=300&q=80',
    category: 'fashion',
    stockCount: 3,
    status: 'Optimal',
    price: '$10,200',
    details: 'Classic diamond quilting, double flap with golden CC signature lock.'
  },
  {
    id: 'f3',
    name: 'Louis Vuitton Silk Scarf',
    image: 'https://images.unsplash.com/photo-1601924582983-777474276c88?auto=format&fit=crop&w=300&q=80',
    category: 'fashion',
    stockCount: 8,
    status: 'Optimal',
    price: '$650',
    details: 'Pure mulberry silk with illustrative Monogram jacquard pattern.'
  }
];

export const INITIAL_CARS: CarNode[] = [
  { id: 'c1', floor: 1, top: 25, left: 20, label: 'B894', model: 'Tesla Model S Plaid', owner: 'Guest 1204', battery: 84, status: 'Parked', checkInTime: '10:14 AM' },
  { id: 'c2', floor: 1, top: 45, left: 60, label: 'B12', model: 'Mercedes-Benz EQS SUV', owner: 'Guest 512', battery: 92, status: 'Parked', checkInTime: '09:44 AM' },
  { id: 'c3', floor: 1, top: 75, left: 35, label: 'L819', model: 'Audi e-tron GT', owner: 'Guest 119V', battery: 67, status: 'Parked', checkInTime: '10:02 AM' },
  
  { id: 'c4', floor: 2, top: 12, left: 75, label: 'B502', model: 'Porsche Taycan Turbo S', owner: 'Guest 809', battery: 52, status: 'Parked', checkInTime: '08:15 AM' },
  { id: 'c5', floor: 2, top: 68, left: 25, label: 'T601', model: 'BMW i7 M70', owner: 'Guest 601', battery: 98, status: 'Parked', checkInTime: '10:30 AM' },
  { id: 'c6', floor: 2, top: 38, left: 50, label: 'BMW', model: 'BMW i8 Roadster', owner: 'Guest 1105', battery: 100, status: 'Parked', checkInTime: '07:22 AM' },
  { id: 'c7', floor: 2, top: 52, left: 78, label: 'B50', model: 'Lucid Air Sapphire', owner: 'Guest 640', battery: 41, status: 'Parked', checkInTime: '09:12 AM' },
  
  { id: 'c8', floor: 3, top: 20, left: 15, label: '894', model: 'Rolls-Royce Spectre Black Badge', owner: 'Guest 901', battery: 93, status: 'Parked', checkInTime: '10:40 AM' },
  { id: 'c9', floor: 3, top: 60, left: 45, label: 'S09', model: 'Polestar 3 Performance', owner: 'Guest 708', battery: 77, status: 'Parked', checkInTime: '09:28 AM' }
];

export const INITIAL_CABANAS: Cabana[] = [
  { id: 'cb1', name: 'Cabana Premium 1', capacity: 6, occupants: 4, status: 'Occupied', x: 22, y: 15 },
  { id: 'cb2', name: 'Cabana Premium 2', capacity: 6, occupants: 0, status: 'Vacant', x: 38, y: 15 },
  { id: 'cb3', name: 'Cabana Premium 3', capacity: 6, occupants: 2, status: 'Occupied', x: 54, y: 15 },
  { id: 'cb4', name: 'VIP Oceanside Suite 4', capacity: 10, occupants: 8, status: 'Occupied', x: 74, y: 15 },
  { id: 'cb5', name: 'Cabana Premium 5', capacity: 6, occupants: 0, status: 'Vacant', x: 25, y: 78 },
  { id: 'cb6', name: 'Cabana Premium 6', capacity: 6, occupants: 5, status: 'Occupied', x: 48, y: 78 },
  { id: 'cb7', name: 'Cabana Premium 7', capacity: 6, occupants: 3, status: 'Occupied', x: 68, y: 78 }
];

export const INITIAL_ORDERS: ServiceOrder[] = [
  {
    id: 'ord1',
    room: 'Room 401',
    title: 'Executive Breakfast',
    items: ['Crush Sourdough Toast', 'Organic Scrambled Eggs', 'Fresh Orange Juice'],
    timeLeft: 720, // 12 minutes
    totalTime: 1200,
    carrier: 'Bot 05 (Aisle 3)',
    carrierType: 'Robot',
    status: 'Preparing'
  },
  {
    id: 'ord2',
    room: 'Room 1205',
    title: 'Gourmet Lunch Duo',
    items: ['Pan-Seared Salmon', 'White Quinoa Toss Salad', 'Sparkling Mineral Water'],
    timeLeft: 270, // 4.5 minutes
    totalTime: 900,
    carrier: 'Maria Lopez (Station 2)',
    carrierType: 'Staff',
    status: 'En Route'
  },
  {
    id: 'ord3',
    room: 'Room 2210',
    title: 'Late Checkout Platter',
    items: ['Artisanal Cheese Selection', 'Cabernet Sauvignon 2018', 'Black Truffle Crackers'],
    timeLeft: 1125, // 18.75 minutes
    totalTime: 1800,
    carrier: 'Bot 12 (Charging Station)',
    carrierType: 'Robot',
    status: 'Preparing'
  }
];

export const INITIAL_THREATS: SecurityEvent[] = [
  { id: 't1', timestamp: '10:44:12 AM', source: 'Firewall API', threatLevel: 'Safe', description: 'SSL handshake successful from authorized hotel applet' },
  { id: 't2', timestamp: '10:41:05 AM', source: 'LPR Scanning Network', threatLevel: 'Safe', description: 'License plate verification approved for Guest 1204 terminal' },
  { id: 't3', timestamp: '10:35:19 AM', source: 'Auxiliary DB Sync', threatLevel: 'Low', description: 'Database synchronization completed with 0 errors' },
  { id: 't4', timestamp: '10:14:02 AM', source: 'RFID Gate 3', threatLevel: 'Moderate', description: 'Unregistered credential scanned - localized restriction active' }
];

export const INITIAL_LOGS: SystemLog[] = [
  { id: 'l1', time: '10:45:00 AM', module: 'SYS_CORE', type: 'OK', message: 'Main server cluster operational. Load distribution optimal (12.4% CPU)' },
  { id: 'l2', time: '10:43:12 AM', module: 'VALET_MGR', type: 'INFO', message: 'Retrieval completed for Guest 809 (Porsche Taycan)' },
  { id: 'l3', time: '10:39:55 AM', module: 'POOL_IOT', type: 'INFO', message: 'Chlorine levels recalibrated. Sensor variance within +/- 0.05%' },
  { id: 'l4', time: '10:35:10 AM', module: 'BOUTIQUE', type: 'WARN', message: 'Reorder alert triggered: Patek Philippe Nautilus low stock status' },
  { id: 'l5', time: '10:28:44 AM', module: 'SYS_SEC', type: 'OK', message: 'Tier 5 dynamic cryptographic keys rotated successfully' },
  { id: 'l6', time: '10:15:02 AM', module: 'ROBOT_FMT', type: 'INFO', message: 'Autonomous delivery fleet synchronized. Charging status optimal' }
];

export const INITIAL_TRADES: EnergyTrade[] = [
  { id: 'tr1', time: '10:32 AM', amount: 50, rate: 0.20, revenue: 10.00, type: 'Sell' },
  { id: 'tr2', time: '10:30 AM', amount: 45.2, rate: 0.22, revenue: 9.94, type: 'Sell' },
  { id: 'tr3', time: '10:28 AM', amount: 35.0, rate: 0.18, revenue: 6.30, type: 'Sell' },
  { id: 'tr4', time: '10:20 AM', amount: 82.1, rate: 0.24, revenue: 19.70, type: 'Sell' }
];
