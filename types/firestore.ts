
export interface Canteen {
  id: string;
  name: string;
  slug: string;
  locationTag: string;
  isActive: boolean;
<<<<<<< HEAD
  type?: 'canteen' | 'mess'; // Optional categorization
=======
>>>>>>> 09ea8e369d2dbd1586a2456433f584d949ee3c71
  image?: string;
}

export type FoodType = "meal" | "snack" | "beverage";
export type Temperature = "hot" | "cold";

export interface MenuItem {
  id: string;
  canteenId: string;
  canteenName?: string; // Derived or joined for UI
  name: string;
  category: string; // Categorization for menu grouping
  price: number;
  isVeg: boolean;
  type: FoodType;
  temperature: Temperature;
  tags: string[];
  rarityWeight: number; // 1–5, lower = rarer in roulette
  emoji: string;
}
