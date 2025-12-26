
import React from 'react';

export const VegIcon: React.FC<{ isVeg: boolean; size?: string }> = ({ isVeg, size = "w-4 h-4" }) => (
  <div className={`${size} border border-${isVeg ? 'green-600' : 'red-600'} rounded-sm flex items-center justify-center p-[2px] bg-white dark:bg-neutral-900 shadow-sm`}>
    <div className={`w-full h-full rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`} style={{ backgroundColor: isVeg ? '#16a34a' : '#dc2626' }}></div>
  </div>
);
