/**
 * Exclusion list for items that should not appear in roulette or popular choices.
 * These are typically add-ons, condiments, or micro-items that aren't standalone meals/snacks.
 */

export const EXCLUDED_ITEM_NAMES = new Set([
    // Exact names (case-insensitive comparison will be used)
    'pav',
    'butter pav',
    'vati chutni',
    'vati chatni',
    'chutni',
    'chutney',
    'onion',
    'extra cheese',
    'cheese slice',
    'extra roti',
    'papad',
    'plate',
    'extra butter',
    'extra mayo',
]);

/**
 * Normalizes an item name for comparison against the exclusion list.
 */
export function normalizeItemName(name: string): string {
    return name.toLowerCase().trim();
}

/**
 * Checks if an item should be excluded from roulette and popular choices.
 * @param itemName - The name of the menu item
 * @param isAddOn - Optional boolean flag if the item is marked as an add-on
 */
export function isItemExcluded(itemName: string, isAddOn?: boolean): boolean {
    if (isAddOn === true) return true;
    return EXCLUDED_ITEM_NAMES.has(normalizeItemName(itemName));
}
