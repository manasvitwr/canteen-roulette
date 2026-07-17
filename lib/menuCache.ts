/**
 * menuCache.ts
 * 
 * Persistent localStorage cache for Firestore menu + canteen data.
 * Strategy: cache-first (serve stale instantly), then refresh in background.
 * 
 * TTL: 1 hour. On cache hit the UI renders immediately; Firestore fetch
 * runs in background and updates state silently if data changed.
 */

import { Canteen, MenuItem } from '../types/firestore.ts';

const CACHE_KEYS = {
  CANTEENS: 'cr_cache_canteens',
  MENU_ITEMS: 'cr_cache_menu_items',
};

const TTL_MS = 60 * 60 * 1000; // 1 hour

interface CacheEntry<T> {
  data: T;
  cachedAt: number;
}

// ─── Canteens ─────────────────────────────────────────────────────────────────

export function getCachedCanteens(): Canteen[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEYS.CANTEENS);
    if (!raw) return null;
    const entry: CacheEntry<Canteen[]> = JSON.parse(raw);
    if (Date.now() - entry.cachedAt > TTL_MS) return null; // stale
    return entry.data;
  } catch {
    return null;
  }
}

export function setCachedCanteens(canteens: Canteen[]): void {
  try {
    const entry: CacheEntry<Canteen[]> = { data: canteens, cachedAt: Date.now() };
    localStorage.setItem(CACHE_KEYS.CANTEENS, JSON.stringify(entry));
  } catch {
    // localStorage quota exceeded — silently skip
  }
}

// ─── Menu Items ───────────────────────────────────────────────────────────────

export function getCachedMenuItems(): MenuItem[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEYS.MENU_ITEMS);
    if (!raw) return null;
    const entry: CacheEntry<MenuItem[]> = JSON.parse(raw);
    if (Date.now() - entry.cachedAt > TTL_MS) return null; // stale
    return entry.data;
  } catch {
    return null;
  }
}

export function setCachedMenuItems(items: MenuItem[]): void {
  try {
    const entry: CacheEntry<MenuItem[]> = { data: items, cachedAt: Date.now() };
    localStorage.setItem(CACHE_KEYS.MENU_ITEMS, JSON.stringify(entry));
  } catch {
    // localStorage quota exceeded — silently skip
  }
}

/** Force-clear both caches (e.g. after admin seed). */
export function clearMenuCache(): void {
  localStorage.removeItem(CACHE_KEYS.CANTEENS);
  localStorage.removeItem(CACHE_KEYS.MENU_ITEMS);
}
