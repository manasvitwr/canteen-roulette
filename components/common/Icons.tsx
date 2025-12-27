
import React from 'react';

// Keep the existing stroke-based icons
export const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-full h-full">
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

export const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-full h-full">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

// SVG-based icons using actual files from assets/icons with proper color inheritance
export const OrdersIcon: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <img
    src="/assets/icons/order.svg"
    alt=""
    className={className}
    style={{
      filter: 'brightness(0) saturate(100%) invert(var(--icon-invert, 0))',
      opacity: 'var(--icon-opacity, 1)'
    }}
  />
);

export const BagIcon: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <img
    src="/assets/icons/bag.svg"
    alt=""
    className={className}
    style={{
      filter: 'brightness(0) saturate(100%) invert(var(--icon-invert, 0))',
      opacity: 'var(--icon-opacity, 1)'
    }}
  />
);

export const ProfileIcon: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <img
    src="/assets/icons/profile.svg"
    alt=""
    className={className}
    style={{
      filter: 'brightness(0) saturate(100%) invert(var(--icon-invert, 0))',
      opacity: 'var(--icon-opacity, 1)'
    }}
  />
);

export const CanteenIcon: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <img
    src="/assets/icons/canteen.svg"
    alt=""
    className={className}
    style={{
      filter: 'brightness(0) saturate(100%) invert(var(--icon-invert, 0))',
      opacity: 'var(--icon-opacity, 1)'
    }}
  />
);

export const HostelIcon: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <img
    src="/assets/icons/hostel.svg"
    alt=""
    className={className}
    style={{
      filter: 'brightness(0) saturate(100%) invert(var(--icon-invert, 0))',
      opacity: 'var(--icon-opacity, 1)'
    }}
  />
);

export const MaggiIcon: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <img
    src="/assets/icons/maggi.svg"
    alt=""
    className={className}
    style={{
      filter: 'brightness(0) saturate(100%) invert(var(--icon-invert, 0))',
      opacity: 'var(--icon-opacity, 1)'
    }}
  />
);

export const CafeIcon: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <img
    src="/assets/icons/cafe.svg"
    alt=""
    className={className}
    style={{
      filter: 'brightness(0) saturate(100%) invert(var(--icon-invert, 0))',
      opacity: 'var(--icon-opacity, 1)'
    }}
  />
);
