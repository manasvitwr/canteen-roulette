
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase.ts';
import { Canteen, MenuItem } from '../types/firestore.ts';
import { getVegPref } from '../lib/db.ts';
import { VegIcon } from '../components/common/VegIcon.tsx';
import { useBag } from '../lib/BagContext.tsx';
import { Toast } from '../components/common/Toast.tsx';
import { CanteenIcon, HostelIcon, MaggiIcon, CafeIcon } from '../components/common/Icons.tsx';

const Explore: React.FC = () => {
  const [search, setSearch] = useState('');
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const vegPref = getVegPref();
  const [expandedCanteen, setExpandedCanteen] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeCanteenFilter, setActiveCanteenFilter] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        console.log('[Explore] Starting to load data from Firestore...');

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
        console.error("[Explore] Failed to load data from Firestore:", err);
        setError("Failed to load menu data. Please check your connection and refresh.");
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

  // Filter items for search with tag filters
  const filteredSearchItems = allMenuItems.filter(item => {
    const searchMatch = item.name.toLowerCase().includes(search.toLowerCase());
    const vegMatch = vegPref === 'veg' ? item.isVeg : true;

    // Apply canteen filter
    const canteenMatch = activeCanteenFilter
      ? item.canteenId === activeCanteenFilter
      : true;

    // Apply category filter
    const categoryMatch = activeCategoryFilter
      ? item.category?.toLowerCase() === activeCategoryFilter.toLowerCase()
      : true;

    return searchMatch && vegMatch && canteenMatch && categoryMatch;
  });

  // Group search results by item name (deduplicate)
  const groupedSearchItems = filteredSearchItems.reduce((acc, item) => {
    if (!acc[item.name]) {
      acc[item.name] = [];
    }
    acc[item.name].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  // Define filter tags
  const canteenTags = [
    { id: 'engg', label: 'Engineering' },
    { id: 'aurobindo', label: 'Auro' },
    { id: 'eklavya', label: 'Eklavya Cafe' },
    { id: 'management', label: 'Management' },
  ];

  const categoryTags = [
    { id: 'Hot', label: 'Hot' },
    { id: 'Cold', label: 'Cold' },
    { id: 'Snack', label: 'Snack' },
    { id: 'Beverage', label: 'Beverage' },
    { id: 'Meal', label: 'Meal' },
  ];

  const handleCanteenTagClick = (canteenId: string | null) => {
    setActiveCanteenFilter(activeCanteenFilter === canteenId ? null : canteenId);
  };

  const handleCategoryTagClick = (category: string | null) => {
    setActiveCategoryFilter(activeCategoryFilter === category ? null : category);
  };

  const clearAllFilters = () => {
    setActiveCanteenFilter(null);
    setActiveCategoryFilter(null);
  };

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
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6 animate-in fade-in slide-in-from-right-8 duration-700">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search items across all canteens..."
          className="w-full pl-6 pr-6 py-4 bg-card rounded-2xl shadow-lg border border-border text-foreground font-medium text-base outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent placeholder:text-muted-foreground"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filter Tags */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {/* All/Clear button */}
          <button
            onClick={clearAllFilters}
            className={`flex-none px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${!activeCanteenFilter && !activeCategoryFilter
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
              }`}
          >
            All
          </button>

          {/* Canteen Tags */}
          {canteenTags.map(tag => (
            <button
              key={tag.id}
              onClick={() => handleCanteenTagClick(tag.id)}
              className={`flex-none px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${activeCanteenFilter === tag.id
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                }`}
            >
              {tag.label}
            </button>
          ))}

          {/* Category Tags */}
          {categoryTags.map(tag => (
            <button
              key={tag.id}
              onClick={() => handleCategoryTagClick(tag.id)}
              className={`flex-none px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${activeCategoryFilter === tag.id
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {search ? (
        <div className="space-y-4">
          <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase px-2">
            Matching items ({Object.keys(groupedSearchItems).length})
          </h2>
          <div className="space-y-3">
            {Object.entries(groupedSearchItems).map(([itemName, items]) => {
              // Pick the first item as representative
              const representativeItem = items[0];
              return (
                <SearchResultCard
                  key={itemName}
                  item={representativeItem}
                  availableCanteens={items.map(i => canteens.find(c => c.id === i.canteenId)?.name || i.canteenId)}
                  onShowToast={setToastMessage}
                />
              );
            })}
            {Object.keys(groupedSearchItems).length === 0 && (
              <p className="text-center py-10 text-muted-foreground font-medium w-full">No results found.</p>
            )}
          </div>
        </div>
      ) : (
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
                  {canteens.filter(c => c.type === 'mess').sort((a, b) => {
                    // Polytechnic Hostel first
                    if (a.id === 'poly-hostel') return -1;
                    if (b.id === 'poly-hostel') return 1;
                    return 0;
                  }).map(canteen => {
                    const canteenItems = getCanteenItems(canteen.id);
                    const filteredCanteenItems = canteenItems.filter(item => vegPref === 'veg' ? item.isVeg : true);
                    const itemCount = filteredCanteenItems.length;

                    // Locked state for Maitreyi and Sandipani hostels
                    const isLocked = canteen.id === 'maitreyi-hostel' || canteen.id === 'sandipani-hostel';

                    // PDF menu for Polytechnic hostel
                    const isPdfMenu = canteen.id === 'poly-hostel';

                    const handlePdfOpen = () => {
                      window.open('/assets/menu/Polytechnic-mess-menu_2025-2026.pdf', '_blank');
                    };

                    return (
                      <div key={canteen.id} className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden relative">
                        {/* Locked overlay for Maitreyi & Sandipani */}
                        {isLocked && (
                          <div className="absolute inset-0 z-10 backdrop-blur-sm bg-black/30 flex flex-col items-center justify-center gap-2 rounded-2xl">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-white">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                            <p className="text-white font-semibold text-sm">Menu coming soon</p>
                          </div>
                        )}

                        <div
                          className={`p-5 flex items-center justify-between ${!isLocked ? 'cursor-pointer active:bg-secondary' : ''} transition-colors`}
                          onClick={() => !isLocked && handleCanteenClick(canteen.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 text-muted-foreground">
                              {getCanteenIcon(canteen)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground text-lg tracking-normal">{canteen.name}</h3>
                              <p className="text-xs text-muted-foreground font-medium">
                                {isPdfMenu ? 'Somaiya Vidyavihar Campus' : `${canteen.locationTag} • ${itemCount} items`}
                              </p>
                            </div>
                          </div>
                          {!isLocked && (
                            <div className={`transition-transform duration-300 ${expandedCanteen === canteen.id ? 'rotate-180' : ''}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-muted-foreground">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Expanded content for non-locked mess cards */}
                        {!isLocked && expandedCanteen === canteen.id && (
                          <div className="bg-muted/50 p-5 border-t border-border space-y-4 animate-in slide-in-from-top-4">
                            {isPdfMenu ? (
                              // PDF menu button for Polytechnic with menu preview
                              <div className="space-y-4">
                                {/* Menu Preview Card - Now Orderable */}
                                <MessThaliCard onShowToast={setToastMessage} />

                                {/* PDF Button */}
                                <div className="flex flex-col items-center gap-3 py-4">
                                  <p className="text-sm text-muted-foreground text-center font-sans">Detailed mess menu available as PDF</p>
                                  <button
                                    onClick={handlePdfOpen}
                                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all active:scale-95 font-semibold font-sans"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                    </svg>
                                    Open full PDF menu
                                  </button>
                                </div>
                              </div>
                            ) : (
                              // Regular menu items for other mess
                              <>
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
                              </>
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
        </div>
      )}

      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
};


// Mess Thali Card Component (Orderable)
const MessThaliCard: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const { addToBag } = useBag();

  // Create a mock MenuItem for Mess Thali
  const messThaliItem: MenuItem = {
    id: 'mess-thali-poly',
    canteenId: 'poly-hostel',
    name: 'Mess Thali',
    price: 70,
    category: 'Unlimited',
    isVeg: true,
    emoji: '🍛',
    tags: ['mess', 'unlimited'],
    slug: 'mess-thali'
  };

  const handleAddToBag = () => {
    addToBag(messThaliItem);
    onShowToast(`Added ${messThaliItem.name} to bag`);
  };

  const handleOrderNow = () => {
    addToBag(messThaliItem);
    onShowToast(`Added ${messThaliItem.name} to bag - Go to Bag to complete order`);
  };

  return (
    <div className="flex-none w-full flex items-center justify-between p-4 bg-card rounded-xl border border-border shadow-sm">
      <div className="flex items-center gap-4">
        <div className="text-3xl">🍛</div>
        <div>
          <h4 className="font-semibold text-foreground text-sm leading-tight tracking-normal font-sans">Mess Thali</h4>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="font-bold text-xs text-accent">₹70 / Plate</p>
            <span className="text-[10px] font-medium text-muted-foreground font-sans">Unlimited</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <VegIcon isVeg={true} size="w-3.5 h-3.5" />
        <button
          onClick={handleAddToBag}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all active:scale-95"
        >
          Add to bag
        </button>
        <button
          onClick={handleOrderNow}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95"
        >
          Order now
        </button>
      </div>
    </div>
  );
};

// Search Result Card Component (Vertical, with canteen context)
const SearchResultCard: React.FC<{
  item: MenuItem;
  availableCanteens: string[];
  onShowToast: (msg: string) => void
}> = ({ item, availableCanteens, onShowToast }) => {
  const { addToBag } = useBag();

  const handleAddToBag = () => {
    addToBag(item);
    onShowToast(`Added ${item.name} to bag`);
  };

  return (
    <div className="w-full flex items-center justify-between p-4 bg-card rounded-xl border border-border shadow-sm hover:border-primary/50 transition-all">
      <div className="flex items-center gap-4">
        <div className="text-3xl">{item.emoji || '🍱'}</div>
        <div>
          <h4 className="font-semibold text-foreground text-sm leading-tight tracking-normal">{item.name}</h4>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="font-bold text-xs text-accent">₹{item.price}</p>
            <span className="text-[10px] font-medium text-muted-foreground">•</span>
            <span className="text-[10px] font-medium text-muted-foreground">{item.category}</span>
            {availableCanteens.length > 0 && (
              <>
                <span className="text-[10px] font-medium text-muted-foreground">•</span>
                <span className="text-[10px] font-medium text-muted-foreground">{availableCanteens[0]}</span>
              </>
            )}
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

// Regular Menu Card Component (Horizontal scroll in canteen sections)
const MenuCard: React.FC<{ item: MenuItem; onShowToast: (msg: string) => void }> = ({ item, onShowToast }) => {
  const { addToBag } = useBag();

  const handleAddToBag = () => {
    addToBag(item);
    onShowToast(`Added ${item.name} to bag`);
  };

  return (
    <div className="flex-none w-80 flex items-center justify-between p-4 bg-card rounded-xl border border-border shadow-sm hover:border-primary/50 transition-all snap-start">
      <div className="flex items-center gap-4">
        <div className="text-3xl">{item.emoji || '🍱'}</div>
        <div>
          <h4 className="font-semibold text-foreground text-sm leading-tight tracking-normal">{item.name}</h4>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="font-bold text-xs text-accent">₹{item.price}</p>
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
