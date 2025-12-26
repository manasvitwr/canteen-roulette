
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase.ts';
import { Canteen, MenuItem } from '../types/firestore.ts';
import { getVegPref } from '../lib/db.ts';
import { VegIcon } from '../components/common/VegIcon.tsx';
import { useBag } from '../lib/BagContext.tsx';
import { Toast } from '../components/common/Toast.tsx';
<<<<<<< HEAD
import { CanteenIcon, HostelIcon, MaggiIcon, CafeIcon } from '../components/common/Icons.tsx';
=======
>>>>>>> 09ea8e369d2dbd1586a2456433f584d949ee3c71

const Explore: React.FC = () => {
  const [search, setSearch] = useState('');
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const vegPref = getVegPref();
  const [expandedCanteen, setExpandedCanteen] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

<<<<<<< HEAD
        console.log('[Explore] Starting to load data from Firestore...');

=======
>>>>>>> 09ea8e369d2dbd1586a2456433f584d949ee3c71
        // Fetch all canteens
        const canteensRef = collection(db, 'canteens');
        const canteensQuery = query(canteensRef, where('isActive', '==', true));
        const canteensSnapshot = await getDocs(canteensQuery);
        const canteensData = canteensSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Canteen));

        // Fetch ALL menu items at once
        const menuRef = collection(db, 'menu_items');
        const menuSnapshot = await getDocs(menuRef);
        const menuData = menuSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as MenuItem));

        console.log(`✅ Loaded ${canteensData.length} canteens and ${menuData.length} menu items from Firestore`);

        setCanteens(canteensData);
        setAllMenuItems(menuData);
      } catch (err) {
<<<<<<< HEAD
        console.error("[Explore] Failed to load data from Firestore:", err);
        setError("Failed to load menu data. Please check your connection and refresh.");
=======
        console.error("Failed to load data from Firestore:", err);
        setError("Failed to load menu data. Please refresh the page.");
>>>>>>> 09ea8e369d2dbd1586a2456433f584d949ee3c71
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCanteenClick = (canteenId: string) => {
    if (expandedCanteen === canteenId) {
      setExpandedCanteen(null);
    } else {
      setExpandedCanteen(canteenId);
    }
  };

  // Filter items for search
  const filteredSearchItems = allMenuItems.filter(item => {
    const searchMatch = item.name.toLowerCase().includes(search.toLowerCase());
    const vegMatch = vegPref === 'veg' ? item.isVeg : true;
    return searchMatch && vegMatch;
  });

  // Helper function to group items by category
  const groupByCategory = (items: MenuItem[]) => {
    return items.reduce((acc, item) => {
      const cat = item.category || 'General';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {} as Record<string, MenuItem[]>);
  };

  // Get items for a specific canteen
  const getCanteenItems = (canteenId: string): MenuItem[] => {
    return allMenuItems.filter(item => item.canteenId === canteenId);
  };

<<<<<<< HEAD
  // Get icon for canteen based on type and ID
  const getCanteenIcon = (canteen: Canteen) => {
    if (canteen.type === 'mess') {
      return <HostelIcon />;
    }
    if (canteen.id === 'maggi') {
      return <MaggiIcon />;
    }
    if (canteen.id === 'eklavya') {
      return <CafeIcon />;
    }
    return <CanteenIcon />;
  };

=======
>>>>>>> 09ea8e369d2dbd1586a2456433f584d949ee3c71
  if (loading) return (
    <div className="flex justify-center py-20 bg-background">
      <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full"></div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 bg-background">
      <p className="text-destructive font-semibold mb-4">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
      >
        Refresh Page
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
      <div className="relative">
        <input
          type="text"
          placeholder="Search items across all canteens..."
          className="w-full pl-6 pr-6 py-4 bg-card rounded-2xl shadow-lg border border-border text-foreground font-medium text-base outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent placeholder:text-muted-foreground"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {search ? (
        <div className="space-y-4">
          <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase px-2">
            Matching items ({filteredSearchItems.length})
          </h2>
<<<<<<< HEAD
          <div className="flex flex-nowrap overflow-x-auto gap-3 pb-2 snap-x snap-mandatory scrollbar-none">
            {filteredSearchItems.map(item => <MenuCard key={item.id} item={item} onShowToast={setToastMessage} />)}
            {filteredSearchItems.length === 0 && (
              <p className="text-center py-10 text-muted-foreground font-medium w-full">No results found.</p>
=======
          <div className="space-y-3">
            {filteredSearchItems.map(item => <MenuCard key={item.id} item={item} onShowToast={setToastMessage} />)}
            {filteredSearchItems.length === 0 && (
              <p className="text-center py-10 text-muted-foreground font-medium">No results found.</p>
>>>>>>> 09ea8e369d2dbd1586a2456433f584d949ee3c71
            )}
          </div>
        </div>
      ) : (
<<<<<<< HEAD
        <div className="space-y-6">
          {canteens.length === 0 ? (
            <p className="text-center py-10 text-neutral-500 dark:text-neutral-400 font-semibold text-sm">No canteens listed yet.</p>
          ) : (
            <>
              {/* Canteens Section */}
              {canteens.filter(c => c.type !== 'mess').length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase px-2">Canteens</h2>
                  {canteens.filter(c => c.type !== 'mess').map(canteen => {
                    const canteenItems = getCanteenItems(canteen.id);
                    const filteredCanteenItems = canteenItems.filter(item => vegPref === 'veg' ? item.isVeg : true);
                    const itemCount = filteredCanteenItems.length;

                    return (
                      <div key={canteen.id} className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                        <div
                          className="p-5 flex items-center justify-between cursor-pointer active:bg-secondary transition-colors"
                          onClick={() => handleCanteenClick(canteen.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 text-muted-foreground">
                              {getCanteenIcon(canteen)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground text-lg tracking-normal">{canteen.name}</h3>
                              <p className="text-xs text-muted-foreground font-medium">
                                {canteen.locationTag} • {itemCount} items
                              </p>
                            </div>
                          </div>
                          <div className={`transition-transform duration-300 ${expandedCanteen === canteen.id ? 'rotate-180' : ''}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-muted-foreground">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                          </div>
                        </div>
                        {expandedCanteen === canteen.id && (
                          <div className="bg-muted/50 p-5 border-t border-border space-y-8 animate-in slide-in-from-top-4">
                            {Object.entries(groupByCategory(filteredCanteenItems)).map(([category, items]) => (
                              <div key={category} className="space-y-3">
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">
                                  {category} ({items.length})
                                </h4>
                                <div className="flex flex-nowrap overflow-x-auto gap-3 pb-2 snap-x snap-mandatory scrollbar-none">
                                  {items.map(item => (
                                    <MenuCard key={item.id} item={item} onShowToast={setToastMessage} />
                                  ))}
                                </div>
                              </div>
                            ))}
                            {filteredCanteenItems.length === 0 && (
                              <p className="text-center py-4 text-muted-foreground text-sm">
                                No items available{vegPref === 'veg' ? ' (veg filter applied)' : ''}.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Mess Section */}
              {canteens.filter(c => c.type === 'mess').length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase px-2">Mess</h2>
                  {canteens.filter(c => c.type === 'mess').map(canteen => {
                    const canteenItems = getCanteenItems(canteen.id);
                    const filteredCanteenItems = canteenItems.filter(item => vegPref === 'veg' ? item.isVeg : true);
                    const itemCount = filteredCanteenItems.length;

                    return (
                      <div key={canteen.id} className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                        <div
                          className="p-5 flex items-center justify-between cursor-pointer active:bg-secondary transition-colors"
                          onClick={() => handleCanteenClick(canteen.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 text-muted-foreground">
                              {getCanteenIcon(canteen)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground text-lg tracking-normal">{canteen.name}</h3>
                              <p className="text-xs text-muted-foreground font-medium">
                                {canteen.locationTag} • {itemCount} items
                              </p>
                            </div>
                          </div>
                          <div className={`transition-transform duration-300 ${expandedCanteen === canteen.id ? 'rotate-180' : ''}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-muted-foreground">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                          </div>
                        </div>
                        {expandedCanteen === canteen.id && (
                          <div className="bg-muted/50 p-5 border-t border-border space-y-8 animate-in slide-in-from-top-4">
                            {Object.entries(groupByCategory(filteredCanteenItems)).map(([category, items]) => (
                              <div key={category} className="space-y-3">
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">
                                  {category} ({items.length})
                                </h4>
                                <div className="flex flex-nowrap overflow-x-auto gap-3 pb-2 snap-x snap-mandatory scrollbar-none">
                                  {items.map(item => (
                                    <MenuCard key={item.id} item={item} onShowToast={setToastMessage} />
                                  ))}
                                </div>
                              </div>
                            ))}
                            {filteredCanteenItems.length === 0 && (
                              <p className="text-center py-4 text-muted-foreground text-sm">
                                No items available{vegPref === 'veg' ? ' (veg filter applied)' : ''}.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
=======
        <div className="space-y-4">
          {canteens.length === 0 && !loading && (
            <p className="text-center py-10 text-neutral-500 dark:text-neutral-400 font-semibold text-sm">No canteens listed yet.</p>
          )}
          {canteens.map(canteen => {
            const canteenItems = getCanteenItems(canteen.id);
            const filteredCanteenItems = canteenItems.filter(item => vegPref === 'veg' ? item.isVeg : true);
            const itemCount = filteredCanteenItems.length;

            return (
              <div key={canteen.id} className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                <div
                  className="p-5 flex items-center justify-between cursor-pointer active:bg-secondary transition-colors"
                  onClick={() => handleCanteenClick(canteen.id)}
                >
                  <div>
                    <h3 className="font-semibold text-foreground text-lg tracking-normal">{canteen.name}</h3>
                    <p className="text-xs text-muted-foreground font-medium">
                      {canteen.locationTag} • {itemCount} items
                    </p>
                  </div>
                  <div className={`transition-transform duration-300 ${expandedCanteen === canteen.id ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-muted-foreground">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
                {expandedCanteen === canteen.id && (
                  <div className="bg-muted/50 p-5 border-t border-border space-y-8 animate-in slide-in-from-top-4">
                    {Object.entries(groupByCategory(filteredCanteenItems)).map(([category, items]) => (
                      <div key={category} className="space-y-3">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">
                          {category} ({items.length})
                        </h4>
                        <div className="space-y-3">
                          {items.map(item => (
                            <MenuCard key={item.id} item={item} onShowToast={setToastMessage} />
                          ))}
                        </div>
                      </div>
                    ))}
                    {filteredCanteenItems.length === 0 && (
                      <p className="text-center py-4 text-muted-foreground text-sm">
                        No items available{vegPref === 'veg' ? ' (veg filter applied)' : ''}.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
>>>>>>> 09ea8e369d2dbd1586a2456433f584d949ee3c71
        </div>
      )}

      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
};

<<<<<<< HEAD

=======
>>>>>>> 09ea8e369d2dbd1586a2456433f584d949ee3c71
const MenuCard: React.FC<{ item: MenuItem; onShowToast: (msg: string) => void }> = ({ item, onShowToast }) => {
  const { addToBag } = useBag();

  const handleAddToBag = () => {
    addToBag(item);
    onShowToast(`Added ${item.name} to bag`);
  };

  return (
<<<<<<< HEAD
    <div className="flex-none w-80 flex items-center justify-between p-4 bg-card rounded-xl border border-border shadow-sm hover:border-primary/50 transition-all snap-start">
=======
    <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border shadow-sm hover:border-primary/50 transition-all">
>>>>>>> 09ea8e369d2dbd1586a2456433f584d949ee3c71
      <div className="flex items-center gap-4">
        <div className="text-3xl">{item.emoji || '🍱'}</div>
        <div>
          <h4 className="font-semibold text-foreground text-sm leading-tight tracking-normal">{item.name}</h4>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="font-bold text-xs" style={{ color: '#F5FF00' }}>₹{item.price}</p>
            <span className="text-[10px] font-medium text-muted-foreground">{item.category}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <VegIcon isVeg={item.isVeg} size="w-3.5 h-3.5" />
        <button
          onClick={handleAddToBag}
          className="w-8 h-8 rounded-lg bg-primary hover:bg-primary/90 flex items-center justify-center text-primary-foreground transition-all active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Explore;
