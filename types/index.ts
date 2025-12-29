
export type VegPreference = "veg" | "non-veg";

export interface UserDoc {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  vegPreference: VegPreference;
  createdAt: number;
  lastLogin: number;
  spinsCount: number;
}

export interface Canteen {
  id: string;
  name: string;
  building: string;
  tags: string[];
  isActive: boolean;
  image?: string;
}

export type FoodType = "meal" | "Snack" | "Beverage";
export type Temperature = "hot" | "cold";

export interface MenuItem {
  id: string;
  canteenId: string;
  canteenName?: string;
  name: string;
  price: number;
  isVeg: boolean;
  type: FoodType;
  temperature: Temperature;
  tags: string[];
  emoji: string;
}

export type OrderStatus = "queued" | "preparing" | "ready" | "picked_up";

export interface Order {
  id: string;
  userId: string;
  item?: MenuItem; // For single item orders (roulette)
  items?: MenuItem[]; // For bag orders (multiple items)
  status: OrderStatus;
  otp?: string;
  estimatedMinutes: number;
  createdAt: number;
  readyAt?: number;
  pickedAt?: number;
}

export interface AppState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
