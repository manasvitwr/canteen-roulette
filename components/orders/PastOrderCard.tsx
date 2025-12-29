import React from 'react';
import { Order } from '../../types';

export const PastOrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const isBagOrder = !!order.items;
  const displayItems = isBagOrder ? order.items! : [order.item!];
  const totalPrice = displayItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="bg-card rounded-3xl p-5 border border-border group hover:border-primary/30 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {isBagOrder ? (
            <>
              <div className="text-3xl opacity-75 grayscale group-hover:grayscale-0 transition-all">🛍️</div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground text-sm">Bag Order ({displayItems.length} items)</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="mt-2 space-y-1">
                  {displayItems.map((item, idx) => (
                    <div key={idx} className="text-xs text-muted-foreground flex items-center gap-1">
                      <span>{item.emoji}</span>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-3xl opacity-75 grayscale group-hover:grayscale-0 transition-all">{order.item!.emoji}</div>
              <div>
                <h4 className="font-semibold text-foreground text-sm">{order.item!.name}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{new Date(order.createdAt).toLocaleDateString()}</span>
                  <span className="text-[10px] text-muted-foreground">•</span>
                  <p className="text-xs text-muted-foreground font-medium">{order.item!.canteenName}</p>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="text-right">
          <span className="block text-sm font-bold" style={{ color: '#F5FF00' }}>₹{totalPrice}</span>
        </div>
      </div>

      {/* Redeemed badge - BOTTOM RIGHT */}
      <div className="self-end mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 text-xs font-semibold rounded-lg w-fit ml-auto">
        ✓ REDEEMED
      </div>
    </div>
  );
};
