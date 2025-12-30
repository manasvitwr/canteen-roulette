import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBag } from '../lib/BagContext.tsx';
import { VegIcon } from '../components/common/VegIcon.tsx';
import { useAuth } from '../App.tsx';
import { createBagOrder } from '../lib/db.ts';

const Bag: React.FC = () => {
    const navigate = useNavigate();
    const { bagItems, removeFromBag, clearBag, bagCount } = useBag();
    const { user, isGuest } = useAuth();

    const totalPrice = bagItems.reduce((sum, item) => sum + item.price, 0);

    const handlePlaceOrder = async () => {
        if (bagItems.length === 0) return;

        const userId = user?.id || 'guest';
        await createBagOrder(userId, bagItems);
        clearBag();
        navigate('/orders');
    };

    return (
        <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-1 text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                    <span className="text-2xl">←</span>
                    <span className="sr-only">Back</span>
                </button>
                <h1 className="text-2xl font-semibold text-foreground">Your Bag</h1>
                <div className="w-8"></div>
            </div>

            {bagCount === 0 ? (
                <div className="p-12 text-center bg-card rounded-3xl border border-border">
                    <div className="text-6xl mb-4">🛍️</div>
                    <p className="text-muted-foreground font-medium text-sm">Your bag is empty</p>
                    <button
                        onClick={() => navigate('/explore')}
                        className="mt-6 px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold text-sm transition-all"
                    >
                        Browse Menu
                    </button>
                </div>
            ) : (
                <>
                    <div className="space-y-3">
                        {bagItems.map((item, index) => (
                            <div
                                key={`${item.id}-${index}`}
                                className="flex items-center justify-between p-4 bg-card rounded-xl border border-border shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-3xl">{item.emoji || '🍱'}</div>
                                    <div>
                                        <h4 className="font-semibold text-foreground text-sm leading-tight tracking-normal">
                                            {item.name}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <p className="font-bold text-xs text-accent">
                                                ₹{item.price}
                                            </p>
                                            <VegIcon isVeg={item.isVeg} size="w-3 h-3" />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFromBag(item.id)}
                                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="w-5 h-5 text-red-500"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                        />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground font-medium">Items</span>
                            <span className="text-foreground font-semibold">{bagCount}</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-border pt-4">
                            <span className="text-foreground font-bold text-lg">Total</span>
                            <span className="text-foreground font-bold text-xl text-accent">
                                ₹{totalPrice}
                            </span>
                        </div>
                        <button
                            onClick={handlePlaceOrder}
                            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold uppercase tracking-wide text-sm shadow-lg active:scale-95 transition-all"
                        >
                            Place Order
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Bag;
