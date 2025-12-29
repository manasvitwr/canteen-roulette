
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App.tsx';
import { useTheme } from '../lib/ThemeContext.tsx';
import { VegPreference } from '../types';
import { setVegPref, getLocalOrders, getVegPref } from '../lib/db.ts';
import { VegIcon } from '../components/common/VegIcon.tsx';

const Profile: React.FC = () => {
  const { user, isGuest, logout, login } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  // Safe data fetching with error handling
  let currentVegPref: VegPreference = 'veg';
  let orders: any[] = [];
  let uniqueItems = 0;

  try {
    currentVegPref = getVegPref();
    orders = getLocalOrders();
    uniqueItems = new Set(orders.map(o => o.item?.id || o.items?.[0]?.id).filter(Boolean)).size;
  } catch (error) {
    console.error('[Profile] Error loading data:', error);
  }

  const handleVegToggle = (pref: VegPreference) => {
    if (user) {
      const updatedUser = { ...user, vegPreference: pref };
      login(updatedUser);
      setVegPref(pref);
    } else if (isGuest) {
      setVegPref(pref);
      window.location.reload();
    }
  };

  if (isGuest) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-10 animate-in fade-in slide-in-from-top-8 duration-700">
        <div className="flex flex-col items-center text-center space-y-6 pt-4">
          <img
            src="/assets/img/3d/guest.png"
            alt="Guest"
            className="w-24 h-24 rounded-full object-cover ring-4 ring-border shadow-xl"
          />
          <div>
            <h2 className="text-2xl font-semibold text-foreground tracking-tight">Guest Explorer</h2>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">Anonymous session</p>
          </div>
        </div>

        <div className="bg-card p-8 rounded-3xl border border-border text-center space-y-4">
          <h3 className="text-xs font-semibold text-primary uppercase tracking-wide">Unlock history & tracking</h3>
          <p className="text-sm text-muted-foreground">Sign in with your @somaiya.edu account to save your roulette history and track live orders.</p>
          <button
            onClick={logout}
            className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold text-xs uppercase tracking-wide transition-all"
          >
            Sign in now
          </button>
        </div>

        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden p-5 space-y-3">
          <span className="text-sm font-semibold text-foreground">Appearance</span>
          <div className="grid grid-cols-3 gap-3">
            <button onClick={() => setTheme('dark')} className={`rounded-lg py-2.5 text-xs font-medium transition-all ${theme === 'dark' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-secondary text-muted-foreground'}`}>Dark</button>
            <button onClick={() => setTheme('light')} className={`rounded-lg py-2.5 text-xs font-medium transition-all ${theme === 'light' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-secondary text-muted-foreground'}`}>Light</button>
            <button onClick={() => setTheme('system')} className={`rounded-lg py-2.5 text-xs font-medium transition-all ${theme === 'system' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-secondary text-muted-foreground'}`}>System</button>
          </div>
          <p className="text-[10px] text-muted-foreground px-1">System mode adapts to your device settings.</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-10 animate-in fade-in slide-in-from-top-8 duration-700">
      <div className="flex flex-col items-center text-center space-y-6 pt-4">
        <div className="relative">
          <img src={user.photoURL} alt={user.displayName} className="w-24 h-24 rounded-full border-4 border-border shadow-xl object-cover" />
          <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[8px] font-bold px-2 py-0.5 rounded-full border-2 border-background uppercase">Student</div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-foreground tracking-tight">{user.displayName}</h2>
          <p className="text-xs text-muted-foreground font-medium tracking-wide">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card p-6 rounded-3xl shadow-sm border border-border text-center">
          <p className="text-3xl font-bold text-primary">{orders.length}</p>
          <p className="text-[10px] text-muted-foreground font-semibold uppercase mt-2 tracking-wide">Total spins</p>
        </div>
        <div className="bg-card p-6 rounded-3xl shadow-sm border border-border text-center">
          <p className="text-3xl font-bold text-primary">{uniqueItems}</p>
          <p className="text-[10px] text-muted-foreground font-semibold uppercase mt-2 tracking-wide">Items found</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden divide-y divide-border">
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-foreground">Food preference</span>
          </div>
          <div className="flex bg-secondary p-1 rounded-xl">
            <button
              onClick={() => handleVegToggle('veg')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 ${currentVegPref === 'veg' ? 'bg-background text-green-500 shadow-sm' : 'text-muted-foreground'}`}
            >
              <VegIcon isVeg={true} size="w-3 h-3" />
              Veg
            </button>
            <button
              onClick={() => handleVegToggle('non-veg')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 ${currentVegPref === 'non-veg' ? 'bg-background text-red-500 shadow-sm' : 'text-muted-foreground'}`}
            >
              <VegIcon isVeg={false} size="w-3 h-3" />
              Anything
            </button>
          </div>
        </div>

        <div className="p-5 space-y-3">
          <span className="text-sm font-semibold text-foreground">Appearance</span>
          <div className="grid grid-cols-3 gap-3">
            <button onClick={() => setTheme('dark')} className={`rounded-lg py-2.5 text-xs font-medium transition-all ${theme === 'dark' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-secondary text-muted-foreground'}`}>Dark</button>
            <button onClick={() => setTheme('light')} className={`rounded-lg py-2.5 text-xs font-medium transition-all ${theme === 'light' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-secondary text-muted-foreground'}`}>Light</button>
            <button onClick={() => setTheme('system')} className={`rounded-lg py-2.5 text-xs font-medium transition-all ${theme === 'system' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-secondary text-muted-foreground'}`}>System</button>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full p-5 text-destructive font-bold uppercase text-[10px] tracking-wider text-left hover:bg-destructive/10 transition-colors"
        >
          Logout session
        </button>
      </div>

      <p className="text-center text-[9px] font-semibold text-muted-foreground uppercase tracking-[0.4em]">Somaiya Vidyavihar • 2024</p>
    </div>
  );
};

export default Profile;
