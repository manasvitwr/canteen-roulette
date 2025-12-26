import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VegPreference, FoodType } from '../types';
import { getVegPref, setVegPref } from '../lib/db.ts';
import { VegIcon } from '../components/common/VegIcon.tsx';

const Filters: React.FC = () => {
  const navigate = useNavigate();
  const [veg, setVeg] = useState<VegPreference>(getVegPref());
  const [budget, setBudget] = useState('any');
  const [foodType, setFoodType] = useState<FoodType | 'any'>('any');

  const handleSave = () => {
    setVegPref(veg);
    navigate(-1);
  };

  const handleBack = () => navigate(-1);

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
              <VegIcon isVeg={false} size="w-3.5 h-3.5" /> Anything
            </button>
          </div>
        </div>

        <FilterSection label="Budget range" value={budget} onChange={setBudget} options={['any', 'low', 'mid', 'high']} />
        <FilterSection label="Meal type" value={foodType} onChange={setFoodType} options={['any', 'meal', 'snack', 'beverage']} />

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