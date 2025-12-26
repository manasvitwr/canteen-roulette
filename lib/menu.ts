
<<<<<<< HEAD
import {
  collection,
  query,
  where,
=======
import { 
  collection, 
  query, 
  where, 
>>>>>>> 09ea8e369d2dbd1586a2456433f584d949ee3c71
  getDocs
} from 'firebase/firestore';
import { db } from './firebase.ts';
import { Canteen, MenuItem, FoodType, Temperature } from '../types/firestore.ts';
import { MOCK_CANTEENS, MOCK_MENU } from './db.ts';

export function getEmojiForItem(name: string, category: string = ''): string {
  const n = name.toLowerCase();
  const c = category.toLowerCase();
<<<<<<< HEAD

  // Coffee and hot beverages - check first to prioritize over other matches
  if (n.includes('coffee') || n.includes('latte') || n.includes('cappuccino') ||
    n.includes('espresso') || n.includes('americano') || n.includes('macchiato') ||
    n.includes('mocha') || n.includes('affogato') || n.includes('tiramisu') ||
    c.includes('coffee') || c.includes('barista')) return '☕';
  if (n.includes('tea') || n.includes('chai')) return '☕';

=======
  
>>>>>>> 09ea8e369d2dbd1586a2456433f584d949ee3c71
  if (n.includes('pizza')) return '🍕';
  if (n.includes('burger')) return '🍔';
  if (n.includes('frankie') || n.includes('franky') || n.includes('wrap') || n.includes('roll')) return '🌯';
  if (n.includes('sandwich') || n.includes('toast') || n.includes('bread')) return '🥪';
  if (n.includes('puff') || n.includes('samosa') || n.includes('croissant') || n.includes('quiche')) return '🥐';
  if (n.includes('maggi') || n.includes('noodle')) return '🍜';
  if (n.includes('pasta')) return '🍝';
  if (n.includes('rice') || n.includes('biryani') || n.includes('korma') || n.includes('kadai') || n.includes('paneer') || n.includes('alu')) return '🍛';
  if (n.includes('thali') || n.includes('mess')) return '🍱';
  if (n.includes('juice') || n.includes('shake') || n.includes('frappe') || n.includes('mojito') || n.includes('soda') || n.includes('ice tea')) return '🥤';
<<<<<<< HEAD
=======
  if (n.includes('tea') || n.includes('coffee') || n.includes('latte') || n.includes('espresso')) return '☕';
>>>>>>> 09ea8e369d2dbd1586a2456433f584d949ee3c71
  if (n.includes('soup')) return '🥣';
  if (n.includes('salad')) return '🥗';
  if (n.includes('doughnut') || n.includes('cake') || n.includes('brownie') || n.includes('pie') || n.includes('tart') || n.includes('choco')) return '🍩';
  if (n.includes('puri') || n.includes('bhel') || n.includes('patties') || n.includes('chat')) return '🥙';
<<<<<<< HEAD

=======
  
>>>>>>> 09ea8e369d2dbd1586a2456433f584d949ee3c71
  return '🍱';
}

export async function getCanteens(): Promise<Canteen[]> {
  try {
    const canteensRef = collection(db, 'canteens');
    const q = query(canteensRef, where('isActive', '==', true));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return MOCK_CANTEENS.map(c => ({
      ...c,
      locationTag: c.building,
      slug: c.id
    })) as unknown as Canteen[];
<<<<<<< HEAD

=======
    
>>>>>>> 09ea8e369d2dbd1586a2456433f584d949ee3c71
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Canteen));
  } catch (error) {
    console.warn("Firestore error, falling back to mock canteens");
    return MOCK_CANTEENS.map(c => ({
      ...c,
      locationTag: c.building,
      slug: c.id
    })) as unknown as Canteen[];
  }
}

export async function getMenuItemsByCanteen(canteenId: string): Promise<MenuItem[]> {
  try {
    const menuRef = collection(db, 'menu_items');
    const q = query(menuRef, where('canteenId', '==', canteenId));
    const querySnapshot = await getDocs(q);
<<<<<<< HEAD

    if (querySnapshot.empty) {
      return MOCK_MENU.filter(item => item.canteenId === canteenId) as unknown as MenuItem[];
    }

=======
    
    if (querySnapshot.empty) {
      return MOCK_MENU.filter(item => item.canteenId === canteenId) as unknown as MenuItem[];
    }
    
>>>>>>> 09ea8e369d2dbd1586a2456433f584d949ee3c71
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
  } catch (error) {
    return MOCK_MENU.filter(item => item.canteenId === canteenId) as unknown as MenuItem[];
  }
}

export interface MenuFilters {
  isVeg?: boolean;
  budget?: 'any' | 'low' | 'mid' | 'high';
  type?: FoodType | 'any';
  temperature?: Temperature | 'any';
}

export async function getFilteredMenuItems(filters: MenuFilters): Promise<MenuItem[]> {
  try {
    const menuRef = collection(db, 'menu_items');
    let q = query(menuRef);
    if (filters.isVeg !== undefined) q = query(q, where('isVeg', '==', filters.isVeg));
<<<<<<< HEAD

    const querySnapshot = await getDocs(q);
    let items = querySnapshot.empty
=======
    
    const querySnapshot = await getDocs(q);
    let items = querySnapshot.empty 
>>>>>>> 09ea8e369d2dbd1586a2456433f584d949ee3c71
      ? MOCK_MENU.filter(i => filters.isVeg === undefined || i.isVeg === filters.isVeg) as unknown as MenuItem[]
      : querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));

    if (filters.type && filters.type !== 'any') {
      items = items.filter(item => item.type === filters.type);
    }

    if (filters.budget && filters.budget !== 'any') {
      items = items.filter(item => {
        if (filters.budget === 'low') return item.price <= 40;
        if (filters.budget === 'mid') return item.price > 40 && item.price <= 100;
        if (filters.budget === 'high') return item.price > 100;
        return true;
      });
    }

    return items;
  } catch (error) {
    return MOCK_MENU.filter(i => filters.isVeg === undefined || i.isVeg === filters.isVeg) as unknown as MenuItem[];
  }
}
