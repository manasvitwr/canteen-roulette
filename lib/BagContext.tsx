import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MenuItem } from '../types';

interface BagContextType {
    bagItems: MenuItem[];
    addToBag: (item: MenuItem) => void;
    removeFromBag: (itemId: string) => void;
    clearBag: () => void;
    bagCount: number;
}

const BagContext = createContext<BagContextType | undefined>(undefined);

export const BagProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [bagItems, setBagItems] = useState<MenuItem[]>([]);

    const addToBag = (item: MenuItem) => {
        setBagItems(prev => [...prev, item]);
    };

    const removeFromBag = (itemId: string) => {
        setBagItems(prev => {
            const index = prev.findIndex(item => item.id === itemId);
            if (index === -1) return prev;
            return [...prev.slice(0, index), ...prev.slice(index + 1)];
        });
    };

    const clearBag = () => {
        setBagItems([]);
    };

    const bagCount = bagItems.length;

    return (
        <BagContext.Provider value={{ bagItems, addToBag, removeFromBag, clearBag, bagCount }}>
            {children}
        </BagContext.Provider>
    );
};

export const useBag = () => {
    const context = useContext(BagContext);
    if (!context) {
        throw new Error('useBag must be used within a BagProvider');
    }
    return context;
};
