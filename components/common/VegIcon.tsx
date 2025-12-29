
import React from 'react';

export const VegIcon: React.FC<{ isVeg: boolean; size?: string }> = ({ isVeg, size = "w-4 h-4" }) => (
  <img 
    src={isVeg ? "/assets/icons/veg.svg" : "/assets/icons/non-veg.svg"} 
    alt={isVeg ? "Veg" : "Non-Veg"}
    className={size}
  />
);
