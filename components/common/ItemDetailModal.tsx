import React from 'react';
import { MenuItem } from '../../types/firestore';
import { VegIcon } from '../common/VegIcon';

interface ItemDetailModalProps {
    item: MenuItem | null;
    canteenName?: string;
    isOpen: boolean;
    onClose: () => void;
    onOrder: () => void;
    onAddToBag: () => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
    item,
    canteenName,
    isOpen,
    onClose,
    onOrder,
    onAddToBag
}) => {
    if (!isOpen || !item) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="bg-card rounded-3xl shadow-2xl border border-border max-w-md w-full pointer-events-auto animate-in zoom-in-95 fade-in duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header with close button */}
                    <div className="flex items-start justify-between p-6 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="text-4xl">{item.emoji || '🍱'}</div>
                            <div>
                                <h3 className="text-xl font-bold text-foreground tracking-tight">
                                    {item.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <VegIcon isVeg={item.isVeg} size="w-3.5 h-3.5" />
                                    <span className="text-sm text-muted-foreground font-medium">
                                        {canteenName || 'Campus Canteen'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-6 pb-4 space-y-3">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="px-3 py-1 rounded-full bg-muted border border-border font-medium">
                                {item.category}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-muted border border-border font-medium">
                                {item.type}
                            </span>
                        </div>

                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold" style={{ color: '#F5FF00' }}>
                                ₹{item.price}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-6 pt-4 border-t border-border flex gap-3">
                        <button
                            onClick={onAddToBag}
                            className="flex-1 px-6 py-3 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-semibold transition-all active:scale-95 border border-border"
                        >
                            Add to bag
                        </button>
                        <button
                            onClick={onOrder}
                            className="flex-1 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all active:scale-95 shadow-md"
                        >
                            Order now
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
