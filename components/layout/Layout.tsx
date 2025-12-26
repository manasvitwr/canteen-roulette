import React from 'react';
import { useAuth } from '../../App.tsx';
import { BottomNav } from './BottomNav.tsx';
import { useBag } from '../../lib/BagContext.tsx';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { BagIcon, ProfileIcon } from '../common/Icons.tsx';
=======
>>>>>>> 09ea8e369d2dbd1586a2456433f584d949ee3c71

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
<<<<<<< HEAD
              className="w-8 h-8 rounded"
=======
              className="w-8 h-8 rounded-md"
>>>>>>> 09ea8e369d2dbd1586a2456433f584d949ee3c71
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
<<<<<<< HEAD
              <div className="w-6 h-6 text-foreground">
                <BagIcon />
              </div>
=======
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-foreground">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
>>>>>>> 09ea8e369d2dbd1586a2456433f584d949ee3c71
              {bagCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {bagCount}
                </span>
              )}
            </button>
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-9 h-9 rounded-full border border-border shadow-sm object-cover" />
            ) : (
<<<<<<< HEAD
              <img src="/assets/guest.png" alt="Guest" className="w-9 h-9 rounded-full border border-border shadow-sm object-cover" />
=======
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center border border-border">
                <span className="text-xs">👤</span>
              </div>
>>>>>>> 09ea8e369d2dbd1586a2456433f584d949ee3c71
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