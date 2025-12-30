
import {
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from './firebase.ts';
import { Canteen, MenuItem, FoodType, Temperature } from '../types/firestore.ts';
import { MOCK_CANTEENS, MOCK_MENU } from './db.ts';

export function getEmojiForItem(name: string, category: string = ''): string {
  const n = name.toLowerCase();
  const c = category.toLowerCase();

  // Coffee and hot Beverages - check first to prioritize over other matches
  if (n.includes('coffee') || n.includes('latte') || n.includes('cappuccino') ||
    n.includes('espresso') || n.includes('americano') || n.includes('macchiato') ||
    n.includes('mocha') || n.includes('affogato') || n.includes('tiramisu') ||
    c.includes('coffee') || c.includes('barista')) return '☕';
  if (n.includes('tea') || n.includes('chai')) return '☕';

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
  if (n.includes('soup')) return '🥣';
  if (n.includes('salad')) return '🥗';
  if (n.includes('doughnut') || n.includes('cake') || n.includes('brownie') || n.includes('pie') || n.includes('tart') || n.includes('choco')) return '🍩';
  if (n.includes('puri') || n.includes('bhel') || n.includes('patties') || n.includes('chat')) return '🥙';

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

    if (querySnapshot.empty) {
      return MOCK_MENU.filter(item => item.canteenId === canteenId) as unknown as MenuItem[];
    }

    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
  } catch (error) {
    return MOCK_MENU.filter(item => item.canteenId === canteenId) as unknown as MenuItem[];
  }
}

export interface MenuFilters {
  isVeg?: boolean;
  priceMin?: number;
  priceMax?: number;
  type?: FoodType | 'any';
  temperature?: Temperature | 'any';
  canteenId?: string;
  mode?: 'on-campus' | 'off-campus';
}

/**
 * Core filtering function for roulette and popular choices.
 * Applies filters in strict order: exclusions → veg → meal type → price (on-campus only)
 */

export async function getFilteredMenuItems(filters: MenuFilters): Promise<MenuItem[]> {
  try {
    const menuRef = collection(db, 'menu_items');
    let q = query(menuRef);

    // Firestore-level filters (only for indexable fields)
    if (filters.isVeg !== undefined) {
      q = query(q, where('isVeg', '==', filters.isVeg));
    }
    if (filters.canteenId) {
      q = query(q, where('canteenId', '==', filters.canteenId));
    }

    const querySnapshot = await getDocs(q);
    let items = querySnapshot.empty
      ? MOCK_MENU.filter(i => filters.isVeg === undefined || i.isVeg === filters.isVeg) as unknown as MenuItem[]
      : querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));

    // Step 1: Apply exclusions FIRST
    const { isItemExcluded } = await import('./exclusions.ts');
    items = items.filter(item => !isItemExcluded(item.name, (item as any).isAddOn));

    // Step 2: Veg filter (already applied in Firestore, but keep for safety)
    if (filters.isVeg !== undefined) {
      items = items.filter(item => item.isVeg === filters.isVeg);
    }

    // Step 3: Meal type filter
    if (filters.type && filters.type !== 'any') {
      const targetType = filters.type.toLowerCase();
      items = items.filter(item => item.type.toLowerCase() === targetType);
    }

    // Step 4: Price range filter (ON-CAMPUS ONLY)
    // Only apply if mode is on-campus AND price filter is explicitly set
    const isOnCampus = !filters.mode || filters.mode === 'on-campus';
    const hasPriceFilter = filters.priceMin !== undefined || filters.priceMax !== undefined;

    if (isOnCampus && hasPriceFilter) {
      const min = filters.priceMin!;
      const max = filters.priceMax!;
      items = items.filter(item => item.price >= min && item.price <= max);
    }

    // Step 5: Temperature filter (if needed)
    if (filters.temperature && filters.temperature !== 'any') {
      items = items.filter(item => item.temperature === filters.temperature);
    }

    return items;
  } catch (error) {
    console.error('Error filtering menu items:', error);
    return MOCK_MENU.filter(i => filters.isVeg === undefined || i.isVeg === filters.isVeg) as unknown as MenuItem[];
  }
}

/**
 * Computes the actual min and max prices from all menu items in Firestore.
 * Returns { min, max } or null if no items exist.
 */
export async function getMenuPriceRange(): Promise<{ min: number; max: number } | null> {
  try {
    const menuRef = collection(db, 'menu_items');
    const querySnapshot = await getDocs(menuRef);

    if (querySnapshot.empty) {
      // Fallback to mock data
      const prices = MOCK_MENU.map(item => item.price);
      return {
        min: Math.min(...prices),
        max: Math.max(...prices)
      };
    }

    const prices = querySnapshot.docs.map(doc => (doc.data() as MenuItem).price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  } catch (error) {
    console.error('Failed to get menu price range:', error);
    return null;
  }
}
