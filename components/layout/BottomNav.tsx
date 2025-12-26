import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, SearchIcon, OrdersIcon, ProfileIcon } from '../common/Icons.tsx';

const NavItem: React.FC<{ to: string, icon: React.ReactNode, label: string }> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex flex-col items-center gap-1.5 transition-all duration-300 px-4 py-1
      ${isActive ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'}
    `}
  >
    <div className="w-6 h-6 transition-transform group-active:scale-90">{icon}</div>
    <span className="text-[10px] font-medium tracking-tight">{label}</span>
  </NavLink>
);

export const BottomNav: React.FC = () => (
  <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border px-2 py-4">
    <div className="flex justify-around items-center max-w-md mx-auto group">
      <NavItem to="/" icon={<HomeIcon />} label="Home" />
      <NavItem to="/explore" icon={<SearchIcon />} label="Explore" />
      <NavItem to="/orders" icon={<OrdersIcon />} label="Orders" />
      <NavItem to="/profile" icon={<ProfileIcon />} label="Profile" />
    </div>
  </nav>
);