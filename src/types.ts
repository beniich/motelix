/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CarNode {
  id: string;
  floor: 1 | 2 | 3;
  top: number; // percentage top
  left: number; // percentage left
  label: string;
  model: string;
  owner: string;
  battery: number;
  status: 'Parked' | 'Retrieving' | 'Ready' | 'Processing';
  checkInTime: string;
}

export interface LuxuryItem {
  id: string;
  name: string;
  image: string;
  category: 'watches' | 'jewelry' | 'fashion';
  stockCount: number;
  status: 'Optimal' | 'Low' | 'Critical' | 'Out of Stock';
  price: string;
  details: string;
}

export interface Cabana {
  id: string;
  name: string;
  capacity: number;
  occupants: number;
  status: 'Occupied' | 'Vacant' | 'Reserved';
  x: number; // coordinates on map percentage
  y: number; // coordinates on map percentage
}

export interface ServiceOrder {
  id: string;
  room: string;
  title: string;
  items: string[];
  timeLeft: number; // in seconds
  totalTime: number; // in seconds
  carrier: string;
  carrierType: 'Robot' | 'Staff';
  status: 'Preparing' | 'En Route' | 'Delivered' | 'Pending';
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  source: string;
  threatLevel: 'Safe' | 'Low' | 'Moderate' | 'Critical';
  description: string;
}

export interface SystemLog {
  id: string;
  time: string;
  module: string;
  type: 'INFO' | 'OK' | 'WARN' | 'ERROR';
  message: string;
}

export interface EnergyTrade {
  id: string;
  time: string;
  amount: number; // kWh
  rate: number; // $/kWh
  revenue: number; // $
  type: 'Buy' | 'Sell';
}

// ============ NEW API TYPES ============

export type Role = 'OPERATOR' | 'MANAGER' | 'ADMIN' | 'SUPER_ADMIN';
export type ClearanceLevel = 'LEVEL-4-ARRIVAL' | 'LEVEL-5-PROPRIETOR';

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  clearance: ClearanceLevel;
  hotelId?: string;
  hotel?: { id: string; name: string };
}

export interface ApiError {
  status: number;
  message: string;
  details?: any;
}

export interface LoginResponse {
  user: CurrentUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface Reservation {
  id: string;
  reference: string;
  guestId: string;
  guest: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    vip: boolean;
    nationality?: string;
  };
  roomId: string | null;
  room: {
    id: string;
    number: string;
    type: string;
    floor: number;
  } | null;
  roomType: string;
  checkIn: string;
  checkOut: string;
  actualCheckIn: string | null;
  actualCheckOut: string | null;
  adults: number;
  children: number;
  status: 'INQUIRY' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED' | 'NO_SHOW';
  source: 'DIRECT' | 'WEBSITE' | 'BOOKING_COM' | 'EXPEDIA' | 'AIRBNB' | 'AGENT' | 'OTHER';
  totalPrice: number;
  currency: string;
  notes?: string;
  createdAt: string;
}

export interface Room {
  id: string;
  number: string;
  floor: number;
  type: string;
  price: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'CLEANING' | 'MAINTENANCE';
  hotelId: string;
}

export interface HousekeepingTask {
  id: string;
  type: 'CHECKOUT_CLEAN' | 'STAYOVER' | 'DEEP_CLEAN' | 'INSPECTION' | 'TURNDOWN';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'INSPECTED' | 'REJECTED';
  priority: number;
  dueAt: string | null;
  room: {
    id: string;
    number: string;
    type: string;
    floor: number;
  };
  assignee: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  reservation?: {
    id: string;
    guest: { firstName: string; lastName: string };
  } | null;
  photos: Array<{ id: string; url: string }>;
}

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  nationality?: string;
  vip: boolean;
  totalStays: number;
  totalRevenue: number;
  lastStayAt: string | null;
  preferences?: string;
}
