
import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import { getLocalOrders, updateOrderStatus } from '../lib/db.ts';
import ActiveOrderCard from '../components/orders/ActiveOrderCard.tsx';
import { PastOrderCard } from '../components/orders/PastOrderCard.tsx';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(getLocalOrders());

  useEffect(() => {
    const interval = setInterval(() => {
      const currentOrders = getLocalOrders();
      let changed = false;
      currentOrders.forEach(o => {
        if (o.status === 'queued' && Date.now() - o.createdAt > 5000) {
          updateOrderStatus(o.id, 'preparing');
          changed = true;
        } else if (o.status === 'preparing' && Date.now() - o.createdAt > 15000) {
          updateOrderStatus(o.id, 'ready');
          changed = true;
        }
      });
      if (changed) setOrders(getLocalOrders());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePickUp = (id: string) => {
    updateOrderStatus(id, 'picked_up');
    setOrders(getLocalOrders());
  };

  const activeOrders = orders.filter(o => o.status !== 'picked_up');
  const pastOrdersList = orders.filter(o => o.status === 'picked_up');

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-10 animate-in fade-in slide-in-from-left-8 duration-700">
      <div className="space-y-5">
        <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase px-2">Active</h2>
        {activeOrders.length === 0 ? (
          <div className="p-12 text-center bg-card rounded-3xl border border-border">
            <p className="text-muted-foreground font-medium text-sm">No active orders</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activeOrders.map(order => <ActiveOrderCard key={order.id} order={order} onPickUp={() => handlePickUp(order.id)} />)}
          </div>
        )}
      </div>

      <div className="space-y-5">
        <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase px-2">History</h2>
        <div className="space-y-4">
          {pastOrdersList.map(order => <PastOrderCard key={order.id} order={order} />)}
          {pastOrdersList.length === 0 && (
            <div className="p-8 text-center bg-muted/50 rounded-2xl border border-border">
              <p className="text-muted-foreground font-medium text-xs">Your history will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
