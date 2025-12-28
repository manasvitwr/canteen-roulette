import React from 'react';
import { useAuth } from '../../App.tsx';
import { BottomNav } from './BottomNav.tsx';
import { useBag } from '../../lib/BagContext.tsx';
import { useNavigate } from 'react-router-dom';
import { BagIcon, ProfileIcon } from '../common/Icons.tsx';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { bagCount } = useBag();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-background text-foreground transition-colors">
      <header className="sticky top-0 z-40 w-full bg-card/80 backdrop-blur-xl border-b border-border px-4 h-16 flex items-center justify-center">
        <div className="w-full max-w-5xl flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/assets/icons/logo.svg"
              alt="Canteen Roulette Logo"
              className="w-8 h-8 rounded"
            />
            <span className="ml-3 text-lg font-bold tracking-tight text-foreground">
              Canteen Roulette
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/bag')}
              className="relative p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <div className="w-6 h-6 text-foreground">
                <BagIcon />
              </div>
              {bagCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {bagCount}
                </span>
              )}
            </button>
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-9 h-9 rounded-full border border-border shadow-sm object-cover" />
            ) : (
              <img src="/assets/img/3d/guest.png" alt="Guest" className="w-9 h-9 rounded-full border border-border shadow-sm object-cover" />
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full bg-background">
        {children}
      </main>

      <BottomNav />
    </div>
  );
};

export default Layout;