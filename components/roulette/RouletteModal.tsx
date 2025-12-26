import React, { useState, useEffect } from 'react';
import Roulette from './Roulette.tsx';
import { Link, useNavigate } from 'react-router-dom';
import { MenuItem } from '../../types/firestore.ts';
import { VegIcon } from '../common/VegIcon.tsx';
import { getEmojiForItem } from '../../lib/menu.ts';
import { useAuth } from '../../App.tsx';
import { createSimulatedOrder } from '../../lib/db.ts';

interface RouletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpin: (mode: 'on-campus' | 'off-campus') => void;
  isSpinning: boolean;
  selectedItem: MenuItem | null;
  setSelectedItem: (item: MenuItem | null) => void;
  onPlaceOrder?: () => void;
  onFindNearby: (loc: { lat: number, lng: number }) => void;
}

const RouletteModal: React.FC<RouletteModalProps> = ({ isOpen, onClose, onSpin, isSpinning, selectedItem, setSelectedItem }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<'on-campus' | 'off-campus'>('on-campus');
  const [orderError, setOrderError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSpinClick = () => {
    setOrderError(null);
    onSpin(mode);
  };

  /**
   * CRITICAL: Mode switch logic preserved. 
   * selectedItem is NO LONGER reset to null, ensuring persistence across tabs.
   */
  const handleToggleMode = (newMode: 'on-campus' | 'off-campus') => {
    if (!isSpinning) {
      setMode(newMode);
      // Removed setSelectedItem(null) to allow item persistence across mode switches
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedItem) return;
    const userId = user?.id || 'guest_' + Date.now();

    setOrderError(null);
    try {
      await createSimulatedOrder(userId, selectedItem as any);
      onClose();
      navigate('/orders');
    } catch (error: any) {
      setOrderError('Failed to place order: ' + error.message);
    }
  };

  const handleFindNearby = () => {
    if (!selectedItem) return;
    const query = `${selectedItem.name} near me`;
    window.open("https://www.google.com/maps/search/" + encodeURIComponent(query), "_blank");
  };

  const handleFindNearCampus = () => {
    if (!selectedItem) return;
    const query = `${selectedItem.name} near Somaiya Vidyavihar campus`;
    window.open("https://www.google.com/maps/search/" + encodeURIComponent(query), "_blank");
  };

  const resultEmoji = selectedItem ? getEmojiForItem(selectedItem.name, selectedItem.category) : undefined;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm px-3 sm:px-4 md:px-6 animate-in fade-in duration-300">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-card rounded-[2rem] sm:rounded-3xl shadow-2xl overflow-hidden border border-border flex flex-col max-h-[90vh] scrollbar-none animate-apple-in">

        {/* Header - Segmented Control & Close Button */}
        <div className="px-4 sm:px-5 md:px-6 py-4 sm:py-5 flex items-center justify-between border-b border-border gap-2">
          <div className="bg-secondary rounded-full p-0.5 sm:p-1 inline-flex gap-0.5 sm:gap-1 flex-shrink-0">
            <button
              onClick={() => handleToggleMode('on-campus')}
              className={`px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-all ${mode === 'on-campus' ? 'bg-foreground text-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              disabled={isSpinning}
            >
              On-Campus
            </button>
            <button
              onClick={() => handleToggleMode('off-campus')}
              className={`px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-all ${mode === 'off-campus' ? 'bg-foreground text-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              disabled={isSpinning}
            >
              Off-Campus
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-2 sm:p-2.5 text-muted-foreground hover:text-foreground transition-colors bg-secondary rounded-full"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-none">
          {/* Slot Machine Graphic Area - Optimized container */}
          <div className="mx-4 sm:mx-5 md:mx-6 mt-4 sm:mt-5 md:mt-6 p-2 sm:p-4 bg-gradient-to-b from-muted to-background rounded-2xl border border-border shadow-inner flex justify-center items-center overflow-hidden">
            <Roulette isSpinning={isSpinning} resultEmoji={resultEmoji} onFinished={() => { }} />
          </div>

          {/* Decision Result Section */}
          <div className="px-4 sm:px-5 md:px-6 py-4 sm:py-5 space-y-1.5 sm:space-y-2 text-center">
            {selectedItem && !isSpinning && (
              <div className="animate-apple-in">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground leading-tight mb-2">
                  {selectedItem.name}
                </h2>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="text-sm sm:text-base text-muted-foreground flex items-center justify-center gap-2 font-medium">
                    <VegIcon isVeg={selectedItem.isVeg} size="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>₹{selectedItem.price}</span>
                  </div>
                  {mode === 'on-campus' ? (
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">{selectedItem.canteenName}</p>
                  ) : (
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">Finding this delicious option nearby...</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions Section */}
          <div className="px-4 sm:px-5 md:px-6 pb-6 space-y-4">
            {!selectedItem || isSpinning ? (
              <button
                onClick={handleSpinClick}
                disabled={isSpinning}
                className="w-full py-2.5 sm:py-3 md:py-3.5 bg-primary hover:bg-primary/90 disabled:bg-secondary disabled:text-muted-foreground rounded-full font-semibold text-sm sm:text-base text-primary-foreground shadow-md active:scale-[0.98] transition-all min-h-[44px]"
              >
                {isSpinning ? 'SPINNING...' : 'SPIN'}
              </button>
            ) : (
              <div className="space-y-4 animate-apple-in">
                {mode === 'on-campus' ? (
                  <div className="space-y-3">
                    <button
                      onClick={handlePlaceOrder}
                      className="w-full py-2.5 sm:py-3 md:py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-semibold text-sm sm:text-base shadow-md active:scale-[0.98] transition-all min-h-[44px]"
                    >
                      Place order
                    </button>
                    {orderError && <p className="text-xs text-red-500 text-center">{orderError}</p>}
                    <p className="text-xs sm:text-sm text-muted-foreground text-center px-4 leading-relaxed font-medium">Simulation only – no real order placed.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={handleFindNearby}
                      className="w-full py-2.5 sm:py-3 md:py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-semibold text-sm sm:text-base shadow-md active:scale-[0.98] transition-all min-h-[44px]"
                    >
                      Find nearby places
                    </button>
                    <div className="text-center">
                      <button
                        onClick={handleFindNearCampus}
                        className="text-xs sm:text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
                      >
                        Find near Somaiya campus
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Secondary Actions & Reset */}
          <div className="px-4 sm:px-5 md:px-6 py-4 sm:py-5 border-t border-border space-y-3 sm:space-y-4">
            {selectedItem && !isSpinning && (
              <button
                onClick={handleSpinClick}
                className="w-full py-2.5 sm:py-3 border-2 border-border text-foreground rounded-full font-semibold text-sm sm:text-base hover:bg-secondary transition-all active:scale-[0.98] min-h-[44px]"
              >
                Spin again
              </button>
            )}
            <div className="text-center">
              <Link
                to="/filters"
                onClick={onClose}
                className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors py-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
                Adjust filters
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouletteModal;
