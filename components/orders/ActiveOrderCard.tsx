
import React from 'react';
import { Order } from '../../types';
import { VegIcon } from '../common/VegIcon.tsx';

interface ActiveOrderCardProps {
  order: Order;
  onPickUp: () => void;
}

const ActiveOrderCard: React.FC<ActiveOrderCardProps> = ({ order, onPickUp }) => {
  const statusConfig = {
    queued: { label: 'Order sent', color: 'text-blue-500', animation: 'animate-pulse' },
    preparing: { label: 'Now cooking', color: 'text-orange-500', animation: '' },
    ready: { label: 'Ready to collect', color: 'text-green-500', animation: 'font-bold scale-105 inline-block transition-transform' },
    picked_up: { label: 'Collected', color: 'text-neutral-600', animation: '' }
  };

  const config = statusConfig[order.status];

  // Support both single item and bag orders
  const isBagOrder = !!order.items;
  const displayItems = isBagOrder ? order.items! : [order.item!];
  const totalPrice = displayItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="relative bg-card rounded-3xl p-5 sm:p-7 shadow-xl border border-border overflow-hidden">
      {isBagOrder ? (
        <>
          <div className="absolute top-0 right-0 p-5">
            <span className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase">Order #{order.id.slice(-4)}</span>
          </div>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-3xl">🛍️</div>
              <h3 className="text-lg font-semibold text-foreground">Bag Order ({displayItems.length} items)</h3>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {displayItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 bg-secondary/50 rounded-lg">
                  <div className="text-2xl">{item.emoji}</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{item.name}</p>
                    <div className="flex items-center gap-2">
                      <VegIcon isVeg={item.isVeg} size="w-2.5 h-2.5" />
                      <span className="text-xs text-accent">₹{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-border flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Total</span>
              <span className="text-lg font-bold text-accent">₹{totalPrice}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="mb-6 sm:mb-8">
          {/* Mobile-friendly header with order number */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-5 mb-3">
            <div className="text-4xl sm:text-5xl flex-shrink-0">{order.item!.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground tracking-normal break-words">{order.item!.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <VegIcon isVeg={order.item!.isVeg} size="w-3 h-3" />
                    <p className="text-xs font-medium tracking-normal"><span className="text-accent">₹{order.item!.price}</span> • <span className="text-muted-foreground">{order.item!.canteenName}</span></p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <span className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase">Order #{order.id.slice(-4)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold uppercase tracking-wider ${config.color} ${config.animation}`}>{config.label}</span>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide">Est. {order.estimatedMinutes} mins</span>
        </div>

        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full bg-primary transition-all duration-1000 ${order.status === 'queued' ? 'w-1/4' : order.status === 'preparing' ? 'w-2/3' : 'w-full'}`}
          ></div>
        </div>

        {order.status === 'ready' && (
          <div className="animate-in zoom-in duration-500 p-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-center space-y-4">
            <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Verification OTP</p>
            <p className="text-4xl font-bold text-green-500 tracking-[0.2em]">{order.otp}</p>
            <button
              onClick={onPickUp}
              className="mt-2 w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-lg active:scale-[0.97] transition-all uppercase tracking-wide"
            >
              Confirm collection
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveOrderCard;
