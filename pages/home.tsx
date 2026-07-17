import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase.ts';
import { Order } from '../types';
import { MenuItem as FirestoreMenuItem, Canteen } from '../types/firestore.ts';
import { getVegPref, getLocalOrders, getPriceRange, getFoodTypeFilter, getSelectedCanteenId } from '../lib/db.ts';
import { getFilteredMenuItems } from '../lib/menu.ts';
import { getCachedCanteens, setCachedCanteens, getCachedMenuItems, setCachedMenuItems } from '../lib/menuCache.ts';
import RouletteModal from '../components/roulette/RouletteModal.tsx';
import { RouletteBanner } from '../components/roulette/RouletteBanner.tsx';
import { useAuth } from '../App.tsx';
import { VegIcon } from '../components/common/VegIcon.tsx';
import { ItemDetailModal } from '../components/common/ItemDetailModal.tsx';
import { useBag } from '../lib/BagContext.tsx';
import { Toast } from '../components/common/Toast.tsx';

const Home: React.FC = () => {
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();
  const { addToBag } = useBag();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FirestoreMenuItem | null>(null);
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [popularItems, setPopularItems] = useState<FirestoreMenuItem[]>([]);
  const [selectedPopularItem, setSelectedPopularItem] = useState<FirestoreMenuItem | null>(null);
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [popularLoading, setPopularLoading] = useState(true);
  const [popularError, setPopularError] = useState<string | null>(null);

  const pickPopular = (canteensData: Canteen[], items: FirestoreMenuItem[]) => {
    const vegPref = getVegPref();
    const priceRange = getPriceRange();
    const foodTypeFilter = getFoodTypeFilter();
    const selectedCanteenId = getSelectedCanteenId();

    let filtered = items.filter(i => {
      if (vegPref === 'veg' && !i.isVeg) return false;
      if (selectedCanteenId && i.canteenId !== selectedCanteenId) return false;
      if (priceRange && (i.price < priceRange.min || i.price > priceRange.max)) return false;
      if (foodTypeFilter && foodTypeFilter !== 'any' && i.type.toLowerCase() !== foodTypeFilter.toLowerCase()) return false;
      return true;
    });

    if (filtered.length === 0 && priceRange) {
      filtered = items.filter(i => {
        if (vegPref === 'veg' && !i.isVeg) return false;
        if (selectedCanteenId && i.canteenId !== selectedCanteenId) return false;
        if (foodTypeFilter && foodTypeFilter !== 'any' && i.type.toLowerCase() !== foodTypeFilter.toLowerCase()) return false;
        return true;
      });
    }

    const canteenMap = new Map(canteensData.map(c => [c.id, c.name]));
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4).map(item => ({
      ...item,
      canteenName: canteenMap.get(item.canteenId) || 'Campus Canteen'
    }));
  };

  const loadPopular = async () => {
    setPopularError(null);
    try {
      // Cache-first: serve instantly, refresh in background
      const cachedCanteens = getCachedCanteens();
      const cachedMenu = getCachedMenuItems();

      if (cachedCanteens && cachedMenu) {
        setCanteens(cachedCanteens);
        setPopularItems(pickPopular(cachedCanteens, cachedMenu));
        setPopularLoading(false);
        // Background refresh
        refreshPopular(cachedCanteens, cachedMenu);
        return;
      }

      // Cold start — fetch from Firestore
      setPopularLoading(true);
      await refreshPopular(null, null);
    } catch (err) {
      console.error('Failed to load popular items:', err);
      setPopularError("Couldn't load popular items. Tap to retry.");
      setPopularLoading(false);
    }
  };

  const refreshPopular = async (
    existingCanteens: Canteen[] | null,
    existingItems: FirestoreMenuItem[] | null
  ) => {
    try {
      const canteensRef = collection(db, 'canteens');
      const canteensSnapshot = await getDocs(canteensRef);
      const canteensData = canteensSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Canteen));
      setCachedCanteens(canteensData);
      if (existingCanteens) setCanteens(canteensData);

      const menuRef = collection(db, 'menu_items');
      const menuSnapshot = await getDocs(menuRef);
      const menuData = menuSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FirestoreMenuItem));
      setCachedMenuItems(menuData);

      const items = menuData;
      if (JSON.stringify(canteensData) !== JSON.stringify(existingCanteens) || JSON.stringify(items) !== JSON.stringify(existingItems)) {
        setCanteens(canteensData);
        setPopularItems(pickPopular(canteensData, items));
      }
    } catch (err) {
      console.error('[Home] Background refresh failed:', err);
      if (!existingCanteens) {
        setPopularError("Couldn't load popular items. Tap to retry.");
      }
    } finally {
      setPopularLoading(false);
    }
  };

  useEffect(() => {
    setPastOrders(getLocalOrders().slice(0, 3));
    loadPopular();
  }, []);



  useEffect(() => {
    if (!isModalOpen) {
      setPastOrders(getLocalOrders().slice(0, 3));
    }
  }, [isModalOpen]);

  const getGreetingPrefix = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleSpin = async (mode: 'on-campus' | 'off-campus') => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedItem(null);
    try {
      const vegPref = getVegPref();
      const priceRange = getPriceRange();
      const foodTypeFilter = getFoodTypeFilter();
      const selectedCanteenId = getSelectedCanteenId();

      const filters: any = {
        isVeg: vegPref === 'veg' ? true : undefined,
        mode: mode
      };

      if (mode === 'on-campus' && selectedCanteenId) {
        filters.selectedCanteenId = selectedCanteenId;
      }

      if (priceRange) {
        filters.priceMin = priceRange.min;
        filters.priceMax = priceRange.max;
      }

      if (foodTypeFilter && foodTypeFilter !== 'any') {
        filters.type = foodTypeFilter;
      }

      const validItems = await getFilteredMenuItems(filters);

      if (validItems.length === 0) {
        setIsSpinning(false);

        if (mode === 'on-campus' && priceRange) {
          alert(`No items in this price range (₹${priceRange.min}-₹${priceRange.max}). Try adjusting your filters!`);
        } else if (foodTypeFilter && foodTypeFilter !== 'any') {
          alert(`No ${foodTypeFilter} items match your current filters!`);
        } else {
          alert("No items match your current filters!");
        }
        return;
      }

      const weightedList: FirestoreMenuItem[] = [];
      validItems.forEach(item => {
        const weight = item.rarityWeight || 1;
        for (let i = 0; i < weight; i++) weightedList.push(item);
      });
      const winner = weightedList[Math.floor(Math.random() * weightedList.length)];

      setTimeout(async () => {
        if (mode === 'on-campus') {
          const canteen = canteens.find(c => c.id === winner.canteenId);
          setSelectedItem({ ...winner, canteenName: canteen?.name || 'Campus Canteen' });
        } else {
          setSelectedItem({ ...winner, canteenId: 'off', canteenName: undefined });
        }
        setIsSpinning(false);
      }, 700);
    } catch (error) {
      console.error('Roulette spin error:', error);
      setIsSpinning(false);
      alert('An error occurred while spinning. Please try again.');
    }
  };

  const handlePopularItemClick = (item: FirestoreMenuItem) => {
    setSelectedPopularItem(item);
  };

  const handleOrderNow = () => {
    setSelectedPopularItem(null);
    navigate('/explore');
  };

  const handleAddToBag = () => {
    if (selectedPopularItem) {
      addToBag(selectedPopularItem as any);
      setToastMessage(`Added ${selectedPopularItem.name} to bag`);
      setSelectedPopularItem(null);
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedPopularItem) {
        setSelectedPopularItem(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [selectedPopularItem]);

  return (
    <div className="mx-auto max-w-5xl px-6 pt-6 pb-24 space-y-6 sm:space-y-10 animate-apple-in">
      {/* Greeting Header */}
      <section className="text-left">
        <p className="text-sm text-muted-foreground font-medium tracking-tight mb-1">
          {isGuest ? 'Hello' : getGreetingPrefix()},
        </p>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          {user?.displayName ? user.displayName.split(' ')[0] : 'Explorer'}
        </h1>
      </section>

      {/* Hero Roulette Banner */}
      <RouletteBanner onSpinClick={() => setIsModalOpen(true)} />

      <RouletteModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setIsSpinning(false); setSelectedItem(null); }}
        onSpin={handleSpin}
        isSpinning={isSpinning}
        selectedItem={selectedItem as any}
        setSelectedItem={setSelectedItem as any}
        onFindNearby={() => { }}
      />

      {/* Popular Items - Grid */}
      <section className="space-y-6">
        <h2 className="text-xs font-bold tracking-[0.15em] text-muted-foreground uppercase ml-2">Popular choices</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {popularItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handlePopularItemClick(item)}
              className="bg-card rounded-2xl p-5 border border-border shadow-sm flex items-center justify-between hover:border-primary/50 transition-all group cursor-pointer active:scale-[0.98]"
            >
              <div className="flex items-center gap-5">
                <VegIcon isVeg={item.isVeg} size="w-3.5 h-3.5" />
                <div>
                  <h4 className="font-semibold text-foreground text-base tracking-tight">{item.name}</h4>
                  <p className="text-sm font-medium">
                    <span className="text-accent font-semibold">₹{item.price}</span> • {item.type} • <span className="text-muted-foreground">{item.canteenName}</span>
                  </p>
                </div>
              </div>
              <div className="text-3xl transition-transform group-hover:scale-110">{item.emoji || '🍱'}</div>
            </div>
          ))}
          {popularLoading && popularItems.length === 0 && (
            <div className="col-span-full py-12 flex justify-center">
              <div className="animate-spin h-6 w-6 border-b-2 border-primary rounded-full"></div>
            </div>
          )}
          {popularError && !popularLoading && (
            <button
              onClick={loadPopular}
              className="col-span-full py-10 text-center text-sm font-medium text-muted-foreground bg-muted rounded-2xl border border-dashed border-border hover:border-primary/50 transition-all"
            >
              {popularError}
            </button>
          )}
        </div>
      </section>

      {/* Recent History - Simple List */}
      <section className="space-y-6">
        <div className="flex items-center justify-between ml-2">
          <h2 className="text-xs font-bold tracking-[0.15em] text-muted-foreground uppercase">Recent activity</h2>
        </div>
        <div className="space-y-3">
          {pastOrders.map((order) => {
            const isBagOrder = !!order.items;
            const displayItem = isBagOrder ? order.items![0] : order.item!;
            const itemCount = isBagOrder ? order.items!.length : 1;

            return (
              <div key={order.id} className="bg-card/60 rounded-2xl p-4 flex items-center justify-between border border-border transition-opacity hover:opacity-100">
                <div className="flex items-center gap-4">
                  <div className="text-2xl opacity-80">{isBagOrder ? '🛍️' : displayItem.emoji}</div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">
                      {isBagOrder ? `Bag Order (${itemCount} items)` : displayItem.name}
                    </h4>
                    <p className="text-xs text-muted-foreground font-medium">
                      {isBagOrder ? displayItem.name : displayItem.canteenName}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-accent">
                  ₹{isBagOrder ? order.items!.reduce((sum, item) => sum + item.price, 0) : displayItem.price}
                </span>
              </div>
            );
          })}
          {pastOrders.length === 0 && (
            <p className="text-center py-10 text-muted-foreground text-sm font-medium bg-muted rounded-2xl border border-dashed border-border">
              Your roulette history will appear here
            </p>
          )}
        </div>
      </section>

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedPopularItem}
        canteenName={selectedPopularItem?.canteenName}
        isOpen={!!selectedPopularItem}
        onClose={() => setSelectedPopularItem(null)}
        onOrder={handleOrderNow}
        onAddToBag={handleAddToBag}
      />

      {/* Toast Notification */}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
};

export default Home;