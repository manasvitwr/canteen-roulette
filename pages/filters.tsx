import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VegPreference, FoodType } from '../types';
import { getVegPref, setVegPref, getPriceRange, setPriceRange, clearPriceRange, getFoodTypeFilter, setFoodTypeFilter } from '../lib/db.ts';
import { getMenuPriceRange } from '../lib/menu.ts';
import { VegIcon } from '../components/common/VegIcon.tsx';

const Filters: React.FC = () => {
  const navigate = useNavigate();
  const [veg, setVeg] = useState<VegPreference>(getVegPref());
  const [foodType, setFoodType] = useState<FoodType | 'any'>((getFoodTypeFilter() as FoodType) || 'any');

  // Price range state
  const [menuPriceRange, setMenuPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(500);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);

  useEffect(() => {
    // Load menu price range
    const loadPriceRange = async () => {
      const range = await getMenuPriceRange();
      if (range) {
        setMenuPriceRange(range);

        // Check if user has saved preferences
        const savedRange = getPriceRange();
        if (savedRange) {
          setPriceMin(savedRange.min);
          setPriceMax(savedRange.max);
        } else {
          // Default to full range
          setPriceMin(range.min);
          setPriceMax(range.max);
        }
      }
      setIsLoadingPrices(false);
    };
    loadPriceRange();
  }, []);

  const handleSave = () => {
    setVegPref(veg);
    setFoodTypeFilter(foodType);

    // Only save price range if it's different from the full range
    if (menuPriceRange && (priceMin !== menuPriceRange.min || priceMax !== menuPriceRange.max)) {
      setPriceRange({ min: priceMin, max: priceMax });
    } else {
      clearPriceRange(); // Clear if using full range
    }

    navigate(-1);
  };

  const handleBack = () => navigate(-1);

  const handlePriceMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setPriceMin(Math.min(value, priceMax));
  };

  const handlePriceMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setPriceMax(Math.max(value, priceMin));
  };

  return (
    <main className="mx-auto max-w-xl px-4 pt-4 pb-24 space-y-4">
      <div className="flex flex-col gap-4">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-1 text-sm text-yellow-400 hover:text-yellow-300 self-start transition-colors"
        >
          <span className="text-2xl">←</span>
          <span className="sr-only">Back</span>
        </button>
        <h1 className="text-2xl font-semibold text-foreground">Filters</h1>
      </div>

      <section className="rounded-3xl bg-card border border-border px-5 py-6 shadow-sm space-y-8">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground">Food preference</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setVeg('veg')}
              className={`h-11 rounded-xl border-2 font-medium text-sm transition-all flex items-center justify-center gap-2 ${veg === 'veg' ? 'bg-green-500/10 border-green-600 text-green-600' : 'bg-secondary border-border text-muted-foreground'}`}
            >
              <VegIcon isVeg={true} size="w-3.5 h-3.5" /> Veg only
            </button>
            <button
              onClick={() => setVeg('non-veg')}
              className={`h-11 rounded-xl border-2 font-medium text-sm transition-all flex items-center justify-center gap-2 ${veg === 'non-veg' ? 'bg-red-500/10 border-red-600 text-red-600' : 'bg-secondary border-border text-muted-foreground'}`}
            >
              <VegIcon isVeg={false} size="w-3.5 h-3.5" /> Non-Veg
            </button>
          </div>
          <p className="text-xs text-muted-foreground italic">*Non-Veg applicable off-campus only</p>
        </div>

        {/* Price Range Slider */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">Price range</h3>
          {isLoadingPrices ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin h-5 w-5 border-b-2 border-primary rounded-full"></div>
            </div>
          ) : menuPriceRange ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">₹{priceMin}</span>
                <span className="text-muted-foreground">₹{priceMax}</span>
              </div>

              {/* Dual Range Slider */}
              <div className="relative h-2">
                {/* Track */}
                <div className="absolute w-full h-2 bg-secondary rounded-full"></div>

                {/* Active Range */}
                <div
                  className="absolute h-2 bg-primary rounded-full"
                  style={{
                    left: `${((priceMin - menuPriceRange.min) / (menuPriceRange.max - menuPriceRange.min)) * 100}%`,
                    right: `${100 - ((priceMax - menuPriceRange.min) / (menuPriceRange.max - menuPriceRange.min)) * 100}%`
                  }}
                ></div>

                {/* Min Slider */}
                <input
                  type="range"
                  min={menuPriceRange.min}
                  max={menuPriceRange.max}
                  value={priceMin}
                  onChange={handlePriceMinChange}
                  className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background [&::-moz-range-thumb]:shadow-md"
                />

                {/* Max Slider */}
                <input
                  type="range"
                  min={menuPriceRange.min}
                  max={menuPriceRange.max}
                  value={priceMax}
                  onChange={handlePriceMaxChange}
                  className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background [&::-moz-range-thumb]:shadow-md"
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Unable to load price range</p>
          )}
        </div>

        <FilterSection label="Meal type" value={foodType} onChange={setFoodType} options={['any', 'meal', 'Snack', 'Beverage']} />

        <div className="pt-4">
          <button
            onClick={handleSave}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold uppercase tracking-wide text-sm shadow-lg active:scale-95 transition-all"
          >
            Save selection
          </button>
        </div>
      </section>
    </main>
  );
};

const FilterSection: React.FC<{ label: string, value: string, onChange: (v: any) => void, options: string[] }> = ({ label, value, onChange, options }) => (
  <div className="space-y-2">
    <h3 className="text-sm font-medium text-foreground">{label}</h3>
    <div className="grid grid-cols-2 gap-3">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`h-10 px-4 rounded-lg border font-medium text-sm capitalize transition-all ${value === opt ? 'bg-primary border-transparent text-primary-foreground shadow-md' : 'bg-secondary border-border text-muted-foreground'}`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

export default Filters;