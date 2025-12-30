import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, SearchIcon, OrdersIcon, ProfileIcon } from '../common/Icons.tsx';
import { cn } from '@/lib/utils';

interface NavItemProps {
  isActive: boolean;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  iconSize?: string;
}

const NavItem: React.FC<NavItemProps> = ({ isActive, href, icon: Icon, label, iconSize = "w-6 h-6" }) => (
  <Link
    to={href}
    className={cn(
      "flex flex-col items-center gap-1 p-2 rounded-lg transition-all group",
      isActive
        ? "text-primary"
        : "text-muted-foreground group-hover:text-foreground/80"
    )}
  >
    <Icon className={iconSize} />
    <span className="text-xs font-medium tracking-tight">{label}</span>
  </Link>
);

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t px-4 pb-4 pt-2" style={{ backgroundColor: 'var(--nav-bg)', borderTopColor: 'var(--nav-border)' }}>
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <NavItem isActive={currentPath === '/'} href="/" icon={HomeIcon} label="Home" />

        {/* Explore */}
        <NavItem isActive={currentPath === '/explore'} href="/explore" icon={SearchIcon} label="Explore" />

        {/* Orders */}
        <NavItem isActive={currentPath === '/orders'} href="/orders" icon={OrdersIcon} label="Orders" iconSize="w-7 h-7" />

        {/* Profile */}
        <NavItem isActive={currentPath === '/profile'} href="/profile" icon={ProfileIcon} label="Profile" />
      </div>
    </div>
  );
};