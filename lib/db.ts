import { Canteen, MenuItem, Order, UserDoc, VegPreference, OrderStatus } from '../types';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db } from './firebase.ts';

export const MOCK_CANTEENS: Canteen[] = [
  { id: 'engg', name: 'Engineering Canteen', building: 'KJSCE Building', tags: ['Siddhi Services', 'Fresh Juice'], isActive: true },
  { id: 'maggi', name: 'Maggi House', building: 'Near Poly', tags: ['Quick Bites', 'Nescafe'], isActive: true },
  { id: 'eklavya', name: 'Eklavya Café', building: 'Library Area', tags: ['Olive Greens', 'Bakery'], isActive: true },
];

export const MOCK_MENU: MenuItem[] = [
  { id: 'ek-1', canteenId: 'eklavya', name: 'Veg Punjabi Samosa', price: 25, isVeg: true, type: 'snack', temperature: 'hot', tags: ['savoury'], emoji: '🥪' },
  { id: 'ek-2', canteenId: 'eklavya', name: 'Veg Puff', price: 30, isVeg: true, type: 'snack', temperature: 'hot', tags: ['bakery'], emoji: '🥐' },
  { id: 'ek-3', canteenId: 'eklavya', name: 'Paneer Chilli Puff', price: 45, isVeg: true, type: 'snack', temperature: 'hot', tags: ['spicy'], emoji: '🥐' },
  { id: 'ek-4', canteenId: 'eklavya', name: 'Veg Burger', price: 70, isVeg: true, type: 'snack', temperature: 'hot', tags: ['classic'], emoji: '🍔' },
  { id: 'ek-5', canteenId: 'eklavya', name: 'Paneer Tikka Sandwich', price: 80, isVeg: true, type: 'snack', temperature: 'hot', tags: ['premium'], emoji: '🥪' },
  { id: 'ek-m1', canteenId: 'eklavya', name: 'Veg Kadai', price: 180, isVeg: true, type: 'meal', temperature: 'hot', tags: ['mughlai'], emoji: '🍛' },
  { id: 'ek-m2', canteenId: 'eklavya', name: 'Paneer Tikka Masala', price: 220, isVeg: true, type: 'meal', temperature: 'hot', tags: ['mughlai'], emoji: '🥘' },
  { id: 'mg-1', canteenId: 'maggi', name: 'Maggi Noodles', price: 25, isVeg: true, type: 'snack', temperature: 'hot', tags: ['classic'], emoji: '🍜' },
  { id: 'mg-3', canteenId: 'maggi', name: 'Nescafe Frappe', price: 30, isVeg: true, type: 'beverage', temperature: 'cold', tags: ['caffeine'], emoji: '🥤' },
  { id: 'en-1', canteenId: 'engg', name: 'Schezwan Noodles Franky', price: 50, isVeg: true, type: 'snack', temperature: 'hot', tags: ['frankie'], emoji: '🌯' },
  { id: 'en-4', canteenId: 'engg', name: 'Orange Juice', price: 52, isVeg: true, type: 'beverage', temperature: 'cold', tags: ['fresh'], emoji: '🍹' },
];

const STORAGE_KEYS = {
  USER: 'cr_user',
  ORDERS: 'cr_orders',
  PREF: 'cr_veg_pref'
};

export const getLocalUser = (): UserDoc | null => {
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const setLocalUser = (user: UserDoc) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getLocalOrders = (): Order[] => {
<<<<<<< HEAD
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('[getLocalOrders] Failed to parse orders:', error);
    return [];
  }
=======
  const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
  return data ? JSON.parse(data) : [];
>>>>>>> 09ea8e369d2dbd1586a2456433f584d949ee3c71
};

export const saveOrder = (order: Order) => {
  const orders = getLocalOrders();
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([order, ...orders]));
};

export async function createSimulatedOrder(userId: string, item: MenuItem): Promise<string> {
  const orderId = 'ord_' + Date.now();
  const orderData: Order = {
    id: orderId,
    userId,
    item,
    status: 'queued',
    createdAt: Date.now(),
    estimatedMinutes: Math.floor(Math.random() * 12) + 4,
    otp: Math.floor(1000 + Math.random() * 9000).toString(),
  };

  // Local first for speed
  saveOrder(orderData);

  // Firestore second (non-blocking)
  setDoc(doc(db, 'orders', orderId), {
    userId,
    itemIds: [item.id],
    status: orderData.status,
    createdAt: orderData.createdAt,
    estimatedMinutes: orderData.estimatedMinutes,
    otp: null,
  }).catch(e => console.warn("Firestore sync failed", e));

  return orderId;
}

export async function createBagOrder(userId: string, items: MenuItem[]): Promise<string> {
  const orderId = 'ord_' + Date.now();

  // Base time for single item: 12-25 minutes (average ~18)
  // For bag orders: add 30-50% more time
  const baseMinutes = Math.floor(Math.random() * 13) + 12; // 12-24 minutes
  const multiplier = 1.3 + (Math.random() * 0.2); // 1.3 to 1.5
  const estimatedMinutes = Math.floor(baseMinutes * multiplier);

  const orderData: Order = {
    id: orderId,
    userId,
    items, // Multiple items for bag order
    status: 'queued',
    createdAt: Date.now(),
    estimatedMinutes,
    otp: Math.floor(1000 + Math.random() * 9000).toString(),
  };

  // Local first for speed
  saveOrder(orderData);

  // Firestore second (non-blocking)
  setDoc(doc(db, 'orders', orderId), {
    userId,
    itemIds: items.map(item => item.id),
    status: orderData.status,
    createdAt: orderData.createdAt,
    estimatedMinutes: orderData.estimatedMinutes,
    otp: null,
  }).catch(e => console.warn("Firestore sync failed", e));

  return orderId;
}

export const updateOrderStatus = (orderId: string, status: OrderStatus) => {
  const orders = getLocalOrders();
  const index = orders.findIndex(o => o.id === orderId);
  if (index !== -1) {
    orders[index].status = status;
    if (status === 'ready' && !orders[index].otp) {
      orders[index].otp = Math.floor(1000 + Math.random() * 9000).toString();
      orders[index].readyAt = Date.now();
    }
    if (status === 'picked_up') orders[index].pickedAt = Date.now();
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }
};

export const getVegPref = (): VegPreference => {
  return (localStorage.getItem(STORAGE_KEYS.PREF) as VegPreference) || 'veg';
};

export const setVegPref = (pref: VegPreference) => {
  localStorage.setItem(STORAGE_KEYS.PREF, pref);
};